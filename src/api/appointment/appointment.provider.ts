import { Injectable, NotFoundException } from '@nestjs/common';
import { BookOnlineSessionDto, BookPhysicalSessionDto } from './dto/book-appointment.dto';
import { User, UserDocument } from '../user/schema/user.schema';
import { AppointmentService } from './appointment.service';
import { DoctorService } from '../doctor/doctor.service';
import { PatientService } from '../patient/patient.service';
import { Types } from 'mongoose';
import { AppointmentMode } from './enums';
import { MailService } from 'src/shared/mail/mail.service';
import { format } from 'date-fns';

@Injectable()
export class AppointmentProvider {
   constructor(
      private readonly appointmentService: AppointmentService,
      private readonly doctorService: DoctorService,
      private readonly patientService: PatientService,
      private readonly mailService: MailService,
   ) {}

   async bookPhysicalSession(bookSessionDto: BookPhysicalSessionDto, doctorId: string, user: UserDocument) {
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
            appointmentMode: AppointmentMode.PHYSICAL,
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

   async bookOnlineSession(bookSessionDto: BookOnlineSessionDto, doctorId: string, user: UserDocument) {
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
         mode: AppointmentMode.ONLINE,
         doctor: doctor._id,
         patient: patient._id,
      });

      await this.mailService.sendMail({
         to: doctor.user._id,
         subject: 'BdMeds',
         template: 'doctor-new-appointment',
         context: {
            doctorName: doctor.user.firstName,
            appointmentMode: AppointmentMode.ONLINE,
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
}
