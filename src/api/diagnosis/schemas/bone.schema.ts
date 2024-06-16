import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PatientDocument } from 'src/api/patient/schema/patient.schema';
import { schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class BoneMetrics {
   @Prop({
      type: Types.ObjectId,
      required: true,
   })
   patient: PatientDocument | string;
}

export type BoneMetricsDocument = HydratedDocument<BoneMetrics>;
export const BoneMetricsSchema = SchemaFactory.createForClass(BoneMetrics);
