import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BookSessionDto, SessionDto } from '../dto/book-appointment.dto';
import { User, UserDocument } from '../../user/schema/user.schema';
import { AppointmentService } from '../services/appointment.service';
import { DoctorService } from '../../doctor/doctor.service';
import { PatientService } from '../../patient/patient.service';
import { FilterQuery, Types } from 'mongoose';
import { AppointmentMode, AppointmentStatus } from '../enums';
import { MailService } from 'src/shared/mail/mail.service';
import { endOfDay, format, startOfDay } from 'date-fns';
import { AppointmentDocument } from '../schemas/appointment.schema';
import { RoleNames } from '../../user/enums';

@Injectable()
export class AppointmentProvider {
   constructor(
      private readonly appointmentService: AppointmentService,
      private readonly doctorService: DoctorService,
      private readonly patientService: PatientService,
      private readonly mailService: MailService,
   ) {}

   private async validatePatientAndDocAvailaibility(
      sessionDto: SessionDto,
      doctorId: string,
      patientId: string,
      isPatient: boolean,
   ) {
      const query: FilterQuery<AppointmentDocument> = {
         appointmentDate: {
            $gte: startOfDay(sessionDto.appointmentDate),
            $lte: endOfDay(sessionDto.appointmentDate),
         },
         $or: [
            {
               startTime: { $lte: sessionDto.endTime },
               endTime: { $gte: sessionDto.startTime },
            },

            {
               startTime: { $gte: sessionDto.startTime },
               endTime: { $lte: sessionDto.endTime },
            },
         ],
         status: AppointmentStatus.PENDING,
      };

      const patientPrevAppointment = await this.appointmentService.getAppointment({
         patient: new Types.ObjectId(patientId),
         ...query,
      });

      if (patientPrevAppointment) {
         throw new BadRequestException(
            `${isPatient ? 'You' : 'This patient'} already have an appointment from ${format(sessionDto.startTime, 'h:mm a')} to ${format(sessionDto.endTime, 'h:mm a')} on ${format(sessionDto.appointmentDate, 'do, MMM yyyy')}, hence, you can select a time within this time interval`,
         );
      }

      const doctorPrevAppointment = await this.appointmentService.getAppointment({
         doctor: new Types.ObjectId(doctorId),
         ...query,
      });

      if (doctorPrevAppointment) {
         throw new BadRequestException(
            `${isPatient ? 'This doctor' : 'You'} already have an appointment from ${format(sessionDto.startTime, 'h:mm a')} to ${format(sessionDto.endTime, 'h:mm a')} on ${format(sessionDto.appointmentDate, 'do, MMM yyyy')}, hence, you can select a time within this time interval`,
         );
      }
   }

   async bookSession(bookSessionDto: BookSessionDto, doctorId: string, user: UserDocument) {
      const doctor = await this.doctorService.getDoctor({ _id: doctorId });

      if (!doctor) throw new NotFoundException('Doctor not found');
      if (!doctor.isAvailable) {
         throw new NotFoundException(`This doctor is not available at the moment`);
      }

      const patient = await this.patientService.getPatient({ user: new Types.ObjectId(user._id) });
      if (!patient) throw new NotFoundException('Patient not found');

      await this.validatePatientAndDocAvailaibility(bookSessionDto, doctor._id, patient._id, true);

      const data = await this.appointmentService.createAppointment({
         ...bookSessionDto,
         mode: AppointmentMode.PHYSICAL,
         department: doctor.department,
         doctor: doctor._id,
         patient: patient._id,
      });

      await this.mailService.sendMail({
         to: doctor.user.email,
         subject: 'BdMeds',
         template: 'doctor-new-appointment',
         context: {
            doctorName: doctor.user.firstName,
            appointmentMode: bookSessionDto.mode,
            patientName: `${user?.firstName} ${user?.lastName}`,
            patientEmail: user?.email,
            patientPhoneNumber: user.phoneNumber,
            appointmentDate: format(bookSessionDto.appointmentDate, 'do, MMM yyyy'),
            startTime: format(bookSessionDto.startTime, 'h:mm a'),
            endTime: format(bookSessionDto.endTime, 'h:mm a'),
         },
      });

      return {
         success: true,
         message: 'Appointment Created',
         data,
      };
   }

   async getDoctorAppointments(doctorId: string) {
      const data = await this.appointmentService.getAppointments({
         doctor: new Types.ObjectId(doctorId),
         status: { $ne: AppointmentStatus.CANCELLED },
      });

      return {
         success: true,
         message: 'Appointments fetched successfully',
         data,
      };
   }

   async getUserDoctorAppointments(userId: string) {
      const doctor = await this.doctorService.getDoctor({ user: new Types.ObjectId(userId) });

      if (!doctor) throw new NotFoundException('Doctor not found');

      return await this.getDoctorAppointments(doctor._id);
   }

   async getPatientAppointments(patientId: string) {
      const data = await this.appointmentService.getAppointments({
         patient: new Types.ObjectId(patientId),
         status: { $ne: AppointmentStatus.CANCELLED },
      });

      return {
         success: true,
         messsage: 'Appointments fetched successfully',
         data,
      };
   }

   async getUserAppointments(user: UserDocument) {
      if (user.role === RoleNames.PATIENT) {
         return await this.getUserPatientAppointments(String(user._id));
      } else if (user.role === RoleNames.DOCTOR) {
         return await this.getUserDoctorAppointments(String(user._id));
      }
   }

   async getUserPatientAppointments(userId: string) {
      const patient = await this.patientService.getPatient({ user: new Types.ObjectId(userId) });

      if (!patient) throw new NotFoundException('Patient not found');

      return await this.getPatientAppointments(patient._id);
   }

   async getAppointment(appointmentId: string) {
      const data = await this.appointmentService.getAppointment({ _id: appointmentId });

      if (!data) throw new NotFoundException('Appointment not found');

      return {
         success: true,
         message: 'appointment fetched',
         data,
      };
   }

   async rescheduleAppointment(sessionDto: SessionDto, appointmentId: string, user: UserDocument) {
      const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });

      if (appointment.status != AppointmentStatus.PENDING)
         throw new BadRequestException('Only pending appointments can be rescheduled');

      if (
         String(appointment.doctor.user._id) != String(user._id) &&
         String(appointment.patient.user._id) != String(user._id)
      ) {
         throw new BadRequestException('Only the doctor/patient of this appointment can reschedule it');
      }

      await this.validatePatientAndDocAvailaibility(
         sessionDto,
         String(appointment.doctor._id),
         String(appointment.patient._id),
         user.role === RoleNames.PATIENT,
      );

      const data = await this.appointmentService.updateAppointment({ _id: appointmentId }, sessionDto);

      const emailContext = {
         doctorName: appointment.doctor.user.firstName,
         patientName: `${appointment.patient.user?.firstName} ${appointment.patient.user?.lastName}`,
         prevAppointmentDate: format(appointment.appointmentDate, 'do, MMM yyyy'),
         prevStartTime: format(appointment.startTime, 'h:mm a'),
         prevEndTime: format(appointment.endTime, 'h:mm a'),
         newAppointmentDate: format(sessionDto.appointmentDate, 'do, MMM yyyy'),
         newStartTime: format(sessionDto.startTime, 'h:mm a'),
         newEndTime: format(sessionDto.endTime, 'h:mm a'),
      };

      await this.mailService.sendMail({
         to: appointment.patient.user.email,
         subject: 'BdMeds: Appointment Reschedule',
         template: 'patient-rescheduled-appointment',
         context: emailContext,
      });

      await this.mailService.sendMail({
         to: appointment.doctor.user.email,
         subject: 'BdMeds: Appointment Reschedule',
         template: 'doctor-rescheduled-appointment',
         context: emailContext,
      });

      return {
         success: true,
         message: 'appointment rescheduled',
         data,
      };
   }

   async cancelAppointment(appointmentId: string, user: UserDocument) {
      const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });

      if (appointment.status != AppointmentStatus.PENDING)
         throw new BadRequestException('Only pending appointments can be rescheduled');

      if (
         String(appointment.doctor.user._id) != String(user._id) &&
         String(appointment.patient.user._id) != String(user._id)
      ) {
         throw new BadRequestException('Only the doctor/patient of this appointment can reschedule it');
      }

      appointment.status = AppointmentStatus.CANCELLED;
      await appointment.save();

      const triggeredByPatient = user.role === RoleNames.PATIENT;
      const triggerer = triggeredByPatient ? appointment.patient.user : appointment.doctor.user;
      const receiver = triggeredByPatient ? appointment.doctor.user : appointment.patient.user;

      await this.mailService.sendMail({
         to: triggeredByPatient ? appointment.doctor.user.email : appointment.patient.user.email,
         subject: 'BDMeds: Cancelled Appoints',
         template: 'appointment-cancelled',
         context: {
            receiverName: `${receiver.firstName} ${receiver.firstName}`,
            triggererName: `${triggerer.firstName} ${triggerer.firstName}`,
            appointmentDate: format(appointment.appointmentDate, 'do, MMM yyyy'),
            startTime: format(appointment.startTime, 'h:mm a'),
            endTime: format(appointment.endTime, 'h:mm a'),
         },
      });

      return {
         success: true,
         message: 'Appointment cancelled successfully',
      };
   }

   async updateAppointmentStatus(status: AppointmentStatus, appointmentId: string, user: UserDocument) {
      const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });

      if (!appointment) throw new NotFoundException('Appointment not found');

      if (user.role === RoleNames.PATIENT) {
         appointment.patientStatus = status;
      } else {
         appointment.doctorStatus = status;
      }

      await appointment.save();

      return {
         success: true,
         message: 'status updated',
      };
   }
}
