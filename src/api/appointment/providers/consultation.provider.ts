import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { ConsultationService } from '../services/consulation.service';
import { AppointmentService } from '../services/appointment.service';
import { MailService } from 'src/shared/mail/mail.service';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';
import { BaseConsultationReport, OrthopedicConsultationReportDto } from '../dto/submit-consultation.dto';
import { Departments } from 'src/api/doctor/enums';
import { DiagnosisService } from 'src/api/diagnosis/diagnosis.service';
import { AppointmentDocument } from '../schemas/appointment.schema';
import { DiagnosisRef } from '../enums';

/**
 * create session
 * check appointment
 * create record
 * create consultation
 * send mail to patient about the report
 */

@Injectable()
export class ConsultationProvider {
   constructor(
      @InjectConnection() private readonly connection: Connection,
      private readonly consultationService: ConsultationService,
      private readonly appointmentService: AppointmentService,
      private readonly mailService: MailService,
      private readonly diagnosisService: DiagnosisService,
   ) {}

   async createConsultationReport(
      createConsultationDto: BaseConsultationReport,
      appointment: AppointmentDocument,
      session: ClientSession,
   ) {}

   async createOrthopedicReport(orthopedicReportDto: OrthopedicConsultationReportDto, appointmentId: string) {
      const session = await this.connection.startSession();
      await session.startTransaction();
      try {
         await session.commitTransaction();

         const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
         if (!appointment) throw new NotFoundException('Appointment not found');

         const diagnosis = await this.diagnosisService.createDiagnosis(
            orthopedicReportDto,
            Departments.ORTHOPEDICS,
            session,
         );

         orthopedicReportDto.appointment = String(appointment._id);
         orthopedicReportDto.diagnosis = String(diagnosis._id);
         orthopedicReportDto.diagnosisRef = DiagnosisRef['BONE_METRICS'];

         return await this.createConsultationReport(orthopedicReportDto, appointment, session);
      } catch (error) {
         await session.abortTransaction();
         throw error;
      } finally {
         await session.endSession();
      }
   }
}
