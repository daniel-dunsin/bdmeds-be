import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Consultation, ConsultationDocument } from 'src/api/appointment/schemas/consultation.schema';
import { Patient, PatientDocument } from 'src/api/patient/schema/patient.schema';
import { schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class BoneMetrics {
   @Prop({
      type: Types.ObjectId,
      required: true,
      ref: Patient.name,
   })
   patient: PatientDocument;

   @Prop({
      type: Types.ObjectId,
      required: true,
      ref: Consultation.name,
   })
   consultation: ConsultationDocument;

   // description
   @Prop()
   boneHealthStatus: string;

   // degrees
   @Prop()
   rangeOfMotion: number;

   @Prop()
   totalFractures: number;
}

export type BoneMetricsDocument = HydratedDocument<BoneMetrics>;
export const BoneMetricsSchema = SchemaFactory.createForClass(BoneMetrics);
