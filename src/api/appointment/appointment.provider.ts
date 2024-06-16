import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BookSessionDto, SessionDto } from './dto/book-appointment.dto';
import { User, UserDocument } from '../user/schema/user.schema';
import { AppointmentService } from './appointment.service';
import { DoctorService } from '../doctor/doctor.service';
import { PatientService } from '../patient/patient.service';
import { FilterQuery, Types } from 'mongoose';
import { AppointmentMode } from './enums';
import { MailService } from 'src/shared/mail/mail.service';
import { endOfDay, format, startOfDay } from 'date-fns';
import { AppointmentDocument } from './schemas/appointment.schema';

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
      };

      const patientPrevAppointment = await this.appointmentService.getAppointment({
         patient: new Types.ObjectId(patientId),
         ...query,
      });

      if (patientPrevAppointment) {
         throw new BadRequestException(
            `${isPatient ? 'You' : 'This patient'} already have an appointment from ${format(sessionDto.startTime, 'h:mm a..aa')} to ${format(sessionDto.endTime, 'h:mm a..aa')} on ${format(sessionDto.appointmentDate, 'do, MMM yyyy')}, hence, you can select a time within this time interval`,
         );
      }

      const doctorPrevAppointment = await this.appointmentService.getAppointment({
         doctor: new Types.ObjectId(doctorId),
         ...query,
      });

      if (doctorPrevAppointment) {
         throw new BadRequestException(
            `${isPatient ? 'This doctor' : 'You'} already have an appointment from ${format(sessionDto.startTime, 'h:mm a..aa')} to ${format(sessionDto.endTime, 'h:mm a..aa')} on ${format(sessionDto.appointmentDate, 'do, MMM yyyy')}, hence, you can select a time within this time interval`,
         );
      }
   }

   async bookSession(bookSessionDto: BookSessionDto, doctorId: string, user: UserDocument) {
      const doctor = await this.doctorService.getDoctor({ _id: doctorId });

      if (!doctor) throw new NotFoundException('Doctor not found');
      if (!doctor.isAvailable) {
         throw new NotFoundException(`This doctor is not available at the moment`);
      }

      const patient = await this.patientService.getPatient({
         user: new Types.ObjectId(user._id),
      });

      const data = await this.appointmentService.createAppointment({
         ...bookSessionDto,
         mode: AppointmentMode.PHYSICAL,
         doctor: doctor._id,
         patient: patient._id,
      });

      await this.mailService.sendMail({
         to: doctor.user._id,
         subject: 'BdMeds',
         template: 'doctor-new-appointment',
         context: {
            doctorName: doctor.user.firstName,
            appointmentMode: bookSessionDto.mode,
            patientName: `${user?.firstName} ${user?.lastName}`,
            patientEmail: user?.email,
            patientPhoneNumber: user.phoneNumber,
            appointmentDate: format(bookSessionDto.appointmentDate, 'do, MMM yyyy'),
            startTime: format(bookSessionDto.startTime, 'h:mm a..aa'),
            endTime: format(bookSessionDto.endTime, 'h:mm a..aa'),
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
      });

      return {
         success: true,
         messsage: 'Appointments fetched successfully',
         data,
      };
   }

   async getUserPatientAppointments(userId: string) {
      const patient = await this.patientService.getPatient({ user: new Types.ObjectId(userId) });

      if (!patient) throw new NotFoundException('Patient not found');

      return await this.getPatientAppointments(patient._id);
   }

   // reschedule
   // book session validation
}
