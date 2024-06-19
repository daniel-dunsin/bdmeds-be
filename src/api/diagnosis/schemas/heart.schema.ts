import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Consultation, ConsultationDocument } from 'src/api/appointment/schemas/consultation.schema';
import { Patient, PatientDocument } from 'src/api/patient/schema/patient.schema';
import { schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class HeartMetrics {
   @Prop({
      type: Types.ObjectId,
      required: true,
      ref: Patient.name,
   })
   patient: PatientDocument;

   @Prop({
      type: Types.ObjectId,
      required: false,
      ref: 'Consultation',
   })
   consultation?: ConsultationDocument | string;

   @Prop()
   heartHealthStatus: string;

   @Prop()
   heartRate: number; // in bpm

   @Prop()
   bloodPressureSystolic: number; // in mmHg

   @Prop()
   bloodPressureDiastolic: number; // in mmHg

   @Prop()
   bloodOxygenLevel: number; // in %

   @Prop()
   cholesterolTotal: number; // in mg/dL

   @Prop()
   cholesterolLDL: number; // in mg/dL

   @Prop()
   cholesterolHDL: number; // in mg/dL

   @Prop()
   ejectionFraction: number; // in %

   @Prop()
   cardiacOutput: number; // in L/min

   @Prop()
   bloodGlucoseLevel: number; // in mg/dL
}

export type HeartMetricsDocument = HydratedDocument<HeartMetrics>;
export const HeartMetricsSchema = SchemaFactory.createForClass(HeartMetrics);
