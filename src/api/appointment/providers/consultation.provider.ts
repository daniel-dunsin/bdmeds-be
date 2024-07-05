import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { ConsultationService } from '../services/consulation.service';
import { AppointmentService } from '../services/appointment.service';
import { MailService } from 'src/shared/mail/mail.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
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
import { DiagnosisDocument } from '../types';

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
      diagnosis: DiagnosisDocument,
   ) {
      const consultation = await this.consultationService.createConsultation(createConsultationDto);

      console.log(consultation);

      await this.mailService.sendMail({
         to: appointment.patient.user.email,
         subject: `BdMeds: Dr. ${appointment.doctor.user.firstName} Consultation Report`,
         template: 'consultation-report-submitted',
         context: {
            patientName: appointment.patient.user.firstName,
            doctorName: appointment.doctor.user.firstName,
            department: appointment.department,
            prescription: consultation.prescription,
         },
      });

      diagnosis.consultation = String(consultation._id) as string;
      await diagnosis.save();
      return {
         success: true,
         message: 'consultation created',
      };
   }

   async createOrthopedicReport(orthopedicReportDto: OrthopedicConsultationReportDto, appointmentId: string) {
      const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
      if (!appointment) throw new NotFoundException('Appointment not found');

      const diagnosis = await this.diagnosisService.createDiagnosis(
         { ...orthopedicReportDto, patient: appointment.patient._id },
         Departments.ORTHOPEDICS,
      );

      orthopedicReportDto.appointment = String(appointment._id);
      orthopedicReportDto.diagnosis = String(diagnosis._id);
      orthopedicReportDto.diagnosisRef = DiagnosisRef['BONE_METRICS'];

      const response = await this.createConsultationReport(
         orthopedicReportDto,
         appointment,
         diagnosis as any,
      );

      return response;
   }

   async createNeurologyReport(neurologyReportDto: NuerologyConsultationReportDto, appointmentId: string) {
      const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
      if (!appointment) throw new NotFoundException('Appointment not found');

      const diagnosis = await this.diagnosisService.createDiagnosis(
         { ...neurologyReportDto, patient: appointment.patient._id },
         Departments.NEUROLOGY,
      );

      neurologyReportDto.appointment = String(appointment._id);
      neurologyReportDto.diagnosis = String(diagnosis._id);
      neurologyReportDto.diagnosisRef = DiagnosisRef['BRAIN_METRICS'];

      const response = await this.createConsultationReport(neurologyReportDto, appointment, diagnosis as any);

      return response;
   }

   async createOptometryReport(optometryReportDto: OptometryConsultationReportDto, appointmentId: string) {
      const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
      if (!appointment) throw new NotFoundException('Appointment not found');

      const diagnosis = await this.diagnosisService.createDiagnosis(
         { ...optometryReportDto, patient: appointment.patient._id },
         Departments.OPTOMETRY,
      );

      optometryReportDto.appointment = String(appointment._id);
      optometryReportDto.diagnosis = String(diagnosis._id);
      optometryReportDto.diagnosisRef = DiagnosisRef['EYES_METRICS'];

      const response = await this.createConsultationReport(optometryReportDto, appointment, diagnosis as any);

      return response;
   }

   async createCardiologyReport(cardiologyReportDto: CardiologyConsultationReportDto, appointmentId: string) {
      const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
      if (!appointment) throw new NotFoundException('Appointment not found');

      const diagnosis = await this.diagnosisService.createDiagnosis(
         { ...cardiologyReportDto, patient: appointment.patient._id },
         Departments.CARDIOLOGY,
      );

      cardiologyReportDto.appointment = String(appointment._id);
      cardiologyReportDto.diagnosis = String(diagnosis._id);
      cardiologyReportDto.diagnosisRef = DiagnosisRef['HEART_METRICS'];

      const response = await this.createConsultationReport(
         cardiologyReportDto,
         appointment,
         diagnosis as any,
      );

      return response;
   }
   async createNephrologyReport(nephrologyReportDto: NephrologyConsultationReportDto, appointmentId: string) {
      const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
      if (!appointment) throw new NotFoundException('Appointment not found');

      const diagnosis = await this.diagnosisService.createDiagnosis(
         { ...nephrologyReportDto, patient: appointment.patient._id },
         Departments.NEPHROLOGY,
      );

      nephrologyReportDto.appointment = String(appointment._id);
      nephrologyReportDto.diagnosis = String(diagnosis._id);
      nephrologyReportDto.diagnosisRef = DiagnosisRef['KIDNEY_METRICS'];

      const response = await this.createConsultationReport(
         nephrologyReportDto,
         appointment,
         diagnosis as any,
      );

      return response;
   }

   async createHepatologyReport(hepatologyReportDto: HepatologyConsultationReportDto, appointmentId: string) {
      const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
      if (!appointment) throw new NotFoundException('Appointment not found');

      const diagnosis = await this.diagnosisService.createDiagnosis(
         { ...hepatologyReportDto, patient: appointment.patient._id },
         Departments.HEPATOLOGY,
      );

      hepatologyReportDto.appointment = String(appointment._id);
      hepatologyReportDto.diagnosis = String(diagnosis._id);
      hepatologyReportDto.diagnosisRef = DiagnosisRef['LIVER_METRICS'];

      const response = await this.createConsultationReport(
         hepatologyReportDto,
         appointment,
         diagnosis as any,
      );

      return response;
   }

   async createDermatologyReport(
      dermatologyReportDto: DermatologyConsultationReportDto,
      appointmentId: string,
   ) {
      const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
      if (!appointment) throw new NotFoundException('Appointment not found');

      const diagnosis = await this.diagnosisService.createDiagnosis(
         { ...dermatologyReportDto, patient: appointment.patient._id },
         Departments.DERMATOLOGY,
      );

      dermatologyReportDto.appointment = String(appointment._id);
      dermatologyReportDto.diagnosis = String(diagnosis._id);
      dermatologyReportDto.diagnosisRef = DiagnosisRef['SKIN_METRICS'];

      const response = await this.createConsultationReport(
         dermatologyReportDto,
         appointment,
         diagnosis as any,
      );

      return response;
   }

   async createDentistryReport(dentistryReportDto: DentistryConsultationReportDto, appointmentId: string) {
      const appointment = await this.appointmentService.getAppointment({ _id: appointmentId });
      if (!appointment) throw new NotFoundException('Appointment not found');

      const diagnosis = await this.diagnosisService.createDiagnosis(
         { ...dentistryReportDto, patient: appointment.patient._id },
         Departments.DENTISTRY,
      );

      dentistryReportDto.appointment = String(appointment._id);
      dentistryReportDto.diagnosis = String(diagnosis._id);
      dentistryReportDto.diagnosisRef = DiagnosisRef['TEETH_METRICS'];

      const response = await this.createConsultationReport(dentistryReportDto, appointment, diagnosis as any);

      return response;
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

   async getReport(reportId: Types.ObjectId | string, department: Departments) {
      const data = await this.diagnosisService.getSingleDiagnosis(
         { _id: new Types.ObjectId(reportId) },
         department,
      );

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

      return await this.getReport(reportId, consultation.appointment.department);
   }
}
