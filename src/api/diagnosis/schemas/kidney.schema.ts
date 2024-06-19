import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Consultation, ConsultationDocument } from 'src/api/appointment/schemas/consultation.schema';
import { Patient, PatientDocument } from 'src/api/patient/schema/patient.schema';
import { schemaOptions } from 'src/shared/constants/db.const';
import { Frequency } from '../enums';

@Schema(schemaOptions)
export class KidneyMetrics {
   @Prop({
      type: Types.ObjectId,
      required: true,
      ref: Patient.name,
   })
   patient: PatientDocument;

   @Prop()
   kidneyHealthStatus: string; // Descriptive

   @Prop()
   creatinine: number; // Milligrams per deciliter (mg/dL)

   @Prop()
   BUN: number; // Milligrams per deciliter (mg/dL)

   @Prop()
   urineProtein: number; // Milligrams per deciliter (mg/dL)

   @Prop()
   dialysisHours: number; // Hours

   @Prop({ type: String, enum: Object.values(Frequency) })
   dialysisFrequency: Frequency; // Frequency

   @Prop({
      type: Types.ObjectId,
      required: false,
      ref: 'Consultation',
   })
   consultation?: ConsultationDocument;
}

export type KidneyMetricsDocument = HydratedDocument<KidneyMetrics>;
export const KidneyMetricsSchema = SchemaFactory.createForClass(KidneyMetrics);
