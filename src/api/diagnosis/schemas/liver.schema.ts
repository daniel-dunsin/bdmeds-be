import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Consultation, ConsultationDocument } from 'src/api/appointment/schemas/consultation.schema';
import { Patient, PatientDocument } from 'src/api/patient/schema/patient.schema';
import { schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class LiverMetrics {
   @Prop({
      type: Types.ObjectId,
      required: true,
      ref: Patient.name,
   })
   patient: PatientDocument;

   @Prop()
   liverHealthStatus: string;

   @Prop()
   altLevel: number; // Units per liter (U/L)

   @Prop()
   astLevel: number; // Units per liter (U/L)

   @Prop()
   bilirubin: number; // Milligrams per deciliter (mg/dL)

   @Prop()
   fibrosisScore: number; // Scaled (e.g., METAVIR score)
}

export type LiverMetricsDocument = HydratedDocument<LiverMetrics>;
export const LiverMetricsSchema = SchemaFactory.createForClass(LiverMetrics);
