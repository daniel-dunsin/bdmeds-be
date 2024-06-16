import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
   Patient,
   PatientDocument,
} from 'src/api/patient/schema/patient.schema';
import { schemaOptions } from 'src/shared/constants/db.const';
import { TempPatient, TempPatientSchema } from './temp-patient.schema';
import { Doctor, DoctorDocument } from 'src/api/doctor/schema/doctor.schema';
import { AppointmentMode, AppointmentStatus } from '../enums';

@Schema(schemaOptions)
export class Appointment {
   @Prop({
      type: Types.ObjectId,
      ref: Patient.name,
      required: false,
   })
   patient: PatientDocument;

   @Prop({
      type: TempPatientSchema,
      required: false,
   })
   tempPatient: TempPatient;

   @Prop({
      type: Types.ObjectId,
      ref: Doctor.name,
      required: true,
   })
   doctor: DoctorDocument;

   @Prop()
   appointmentDate: Date;

   @Prop()
   startTime: Date;

   @Prop()
   endTime: Date;

   @Prop({
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.PENDING,
   })
   status: AppointmentStatus;

   @Prop({
      type: String,
      enum: Object.values(AppointmentMode),
      required: true,
   })
   mode: AppointmentMode;

   // add the invoice
}

export type AppointmentDocument = HydratedDocument<Appointment>;
export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
