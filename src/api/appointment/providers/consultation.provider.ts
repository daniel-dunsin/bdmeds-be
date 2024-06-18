import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { ConsultationService } from '../services/consulation.service';
import { AppointmentService } from '../services/appointment.service';
import { MailService } from 'src/shared/mail/mail.service';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection, Types } from 'mongoose';
import {
   BaseConsultationReport,
   CardiologyConsultationReportDto,
   DentistryConsultationReportDto,
   DermatologyConsultationReportDto,
   HepatologyConsultationReportDto,
   NephrologyConsultationReportDto,
   NuerologyConsultationReportDto,
   OptometryConsultationReportDto,
   OrthopedicConsultationReportDto,
} from '../dto/submit-consultation.dto';
import { Departments } from 'src/api/doctor/enums';
import { DiagnosisService } from 'src/api/diagnosis/diagnosis.service';
import { AppointmentDocument } from '../schemas/appointment.schema';
import { DiagnosisRef } from '../enums';
import { PatientService } from 'src/api/patient/patient.service';

@Injectable()
export class ConsultationProvider {
   constructor(
      @InjectConnection() private readonly connection: Connection,
      private readonly consultationService: ConsultationService,
      private readonly appointmentService: AppointmentService,
      private readonly mailService: MailService,
      private readonly diagnosisService: DiagnosisService,
      private readonly patientService: PatientService,
   ) {}

   async createConsultationReport(
      createConsultationDto: BaseConsultationReport,
      appointment: AppointmentDocument,
      session: ClientSession,
   ) {
      const consultation = await this.consultationService.createConsultation(createConsultationDto, session);

      await this.mailService.sendMail({
         to: appointment.patient.user.email,
         subject: `BdMeds: Dr. ${appointment.doctor.user.firstName} Consultation Report`,
         template: 'consultation-report-submitted',
         context: {
            patientName: appointment.patient.user.firstName,
            doctorName: appointment.doctor.user.firstName,
            department: appointment.department,
         },
      });

      return {
         success: true,
         message: 'consultation created',
      };
   }

   async createOrthopedicReport(orthopedicReportDto: OrthopedicConsultationReportDto, appointmentId: string) {
      const session = await this.connection.startSession();
      await session.startTransaction();
      try {

         const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
         if (!appointment) throw new NotFoundException('Appointment not found');

         const diagnosis = await this.diagnosisService.createDiagnosis(
            { ...orthopedicReportDto, patient: appointment.patient._id },
            Departments.ORTHOPEDICS,
            session,
         );

         orthopedicReportDto.appointment = String(appointment._id);
         orthopedicReportDto.diagnosis = String(diagnosis._id);
         orthopedicReportDto.diagnosisRef = DiagnosisRef['BONE_METRICS'];

         const response = await this.createConsultationReport(orthopedicReportDto, appointment, session);
         await session.commitTransaction();
         return response;
      } catch (error) {
         await session.abortTransaction();
         throw error;
      } finally {
         await session.endSession();
      }
   }

   async createNeurologyReport(neurologyReportDto: NuerologyConsultationReportDto, appointmentId: string) {
      const session = await this.connection.startSession();
      await session.startTransaction();
      try {

         const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
         if (!appointment) throw new NotFoundException('Appointment not found');

         const diagnosis = await this.diagnosisService.createDiagnosis(
            { ...neurologyReportDto, patient: appointment.patient._id },
            Departments.NEUROLOGY,
            session,
         );

         neurologyReportDto.appointment = String(appointment._id);
         neurologyReportDto.diagnosis = String(diagnosis._id);
         neurologyReportDto.diagnosisRef = DiagnosisRef['BRAIN_METRICS'];

         const response = await this.createConsultationReport(neurologyReportDto, appointment, session);
         await session.commitTransaction();
         return response;
      } catch (error) {
         await session.abortTransaction();
         throw error;
      } finally {
         await session.endSession();
      }
   }

   async createOptometryReport(optometryReportDto: OptometryConsultationReportDto, appointmentId: string) {
      const session = await this.connection.startSession();
      await session.startTransaction();
      try {
         const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
         if (!appointment) throw new NotFoundException('Appointment not found');

         const diagnosis = await this.diagnosisService.createDiagnosis(
            { ...optometryReportDto, patient: appointment.patient._id },
            Departments.OPTOMETRY,
            session,
         );

         optometryReportDto.appointment = String(appointment._id);
         optometryReportDto.diagnosis = String(diagnosis._id);
         optometryReportDto.diagnosisRef = DiagnosisRef['EYES_METRICS'];

         const response = await this.createConsultationReport(optometryReportDto, appointment, session);
         await session.commitTransaction();
         return response;
      } catch (error) {
         await session.abortTransaction();
         throw error;
      } finally {
         await session.endSession();
      }
   }

   async createCardiologyReport(cardiologyReportDto: CardiologyConsultationReportDto, appointmentId: string) {
      const session = await this.connection.startSession();
      await session.startTransaction();
      try {
         const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
         if (!appointment) throw new NotFoundException('Appointment not found');

         const diagnosis = await this.diagnosisService.createDiagnosis(
            { ...cardiologyReportDto, patient: appointment.patient._id },
            Departments.CARDIOLOGY,
            session,
         );

         cardiologyReportDto.appointment = String(appointment._id);
         cardiologyReportDto.diagnosis = String(diagnosis._id);
         cardiologyReportDto.diagnosisRef = DiagnosisRef['HEART_METRICS'];

         const response = await this.createConsultationReport(cardiologyReportDto, appointment, session);
         await session.commitTransaction();
         return response;
      } catch (error) {
         await session.abortTransaction();
         throw error;
      } finally {
         await session.endSession();
      }
   }
   async createNephrologyReport(nephrologyReportDto: NephrologyConsultationReportDto, appointmentId: string) {
      const session = await this.connection.startSession();
      await session.startTransaction();
      try {

         const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
         if (!appointment) throw new NotFoundException('Appointment not found');

         const diagnosis = await this.diagnosisService.createDiagnosis(
            { ...nephrologyReportDto, patient: appointment.patient._id },
            Departments.NEPHROLOGY,
            session,
         );

         nephrologyReportDto.appointment = String(appointment._id);
         nephrologyReportDto.diagnosis = String(diagnosis._id);
         nephrologyReportDto.diagnosisRef = DiagnosisRef['KIDNEY_METRICS'];

         const response = await this.createConsultationReport(nephrologyReportDto, appointment, session);
         await session.commitTransaction();
         return response;
      } catch (error) {
         await session.abortTransaction();
         throw error;
      } finally {
         await session.endSession();
      }
   }

   async createHepatologyReport(hepatologyReportDto: HepatologyConsultationReportDto, appointmentId: string) {
      const session = await this.connection.startSession();
      await session.startTransaction();
      try {
         const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
         if (!appointment) throw new NotFoundException('Appointment not found');

         const diagnosis = await this.diagnosisService.createDiagnosis(
            { ...hepatologyReportDto, patient: appointment.patient._id },
            Departments.HEPATOLOGY,
            session,
         );

         hepatologyReportDto.appointment = String(appointment._id);
         hepatologyReportDto.diagnosis = String(diagnosis._id);
         hepatologyReportDto.diagnosisRef = DiagnosisRef['LIVER_METRICS'];

         const response = await this.createConsultationReport(hepatologyReportDto, appointment, session);
         await session.commitTransaction();
         return response;
      } catch (error) {
         await session.abortTransaction();
         throw error;
      } finally {
         await session.endSession();
      }
   }

   async createDermatologyReport(
      dermatologyReportDto: DermatologyConsultationReportDto,
      appointmentId: string,
   ) {
      const session = await this.connection.startSession();
      await session.startTransaction();
      try {

         const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
         if (!appointment) throw new NotFoundException('Appointment not found');

         const diagnosis = await this.diagnosisService.createDiagnosis(
            { ...dermatologyReportDto, patient: appointment.patient._id },
            Departments.DERMATOLOGY,
            session,
         );

         dermatologyReportDto.appointment = String(appointment._id);
         dermatologyReportDto.diagnosis = String(diagnosis._id);
         dermatologyReportDto.diagnosisRef = DiagnosisRef['SKIN_METRICS'];

         const response = await this.createConsultationReport(dermatologyReportDto, appointment, session);
         await session.commitTransaction();
         return response;
      } catch (error) {
         await session.abortTransaction();
         throw error;
      } finally {
         await session.endSession();
      }
   }

   async createDentistryReport(dentistryReportDto: DentistryConsultationReportDto, appointmentId: string) {
      const session = await this.connection.startSession();
      await session.startTransaction();
      try {
         const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
         if (!appointment) throw new NotFoundException('Appointment not found');

         const diagnosis = await this.diagnosisService.createDiagnosis(
            { ...dentistryReportDto, patient: appointment.patient._id },
            Departments.DENTISTRY,
            session,
         );

         dentistryReportDto.appointment = String(appointment._id);
         dentistryReportDto.diagnosis = String(diagnosis._id);
         dentistryReportDto.diagnosisRef = DiagnosisRef['TEETH_METRICS'];

         const response = await this.createConsultationReport(dentistryReportDto, appointment, session);
         await session.commitTransaction();
         return response;
      } catch (error) {
         await session.abortTransaction();
         throw error;
      } finally {
         await session.endSession();
      }
   }

   async getPatientReports(department: Departments, patientId: string) {
      const data = await this.diagnosisService.getMultipleDiagnosis(
         { patient: new Types.ObjectId(patientId) },
         department,
      );

      return {
         success: true,
         message: 'Reports fetched successfully',
         data,
      };
   }

   async getReports(department: Departments, userId: string) {
      const patient = await this.patientService.getPatient({ user: new Types.ObjectId(userId) });

      if (!patient) throw new NotFoundException('Patient not found');

      return await this.getPatientReports(department, patient._id);
   }

   async getReport(reportId: string, department: Departments) {
      const data = await this.diagnosisService.getSingleDiagnosis({ _id: reportId }, department);

      if (!data) throw new NotFoundException("Oops! We can't find this report");

      return {
         success: true,
         message: 'Report fetched successfully',
         data,
      };
   }

   async getAppoinmentReport(appointmentId: string) {
      const consultation = await this.consultationService.getConsultation({ appointment: appointmentId });

      if (!consultation) throw new NotFoundException("Opps! We can't find the consultation for this report");

      const reportId = consultation?.diagnosis?._id;

      return await this.getReport(String(reportId), consultation.appointment.department);
   }
}
