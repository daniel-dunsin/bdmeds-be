import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PatientDocument } from 'src/api/patient/schema/patient.schema';
import { schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class BrainMetrics {
   @Prop({
      type: Types.ObjectId,
      required: true,
   })
   patient: PatientDocument | string;
}

export type BrainMetricsDocument = HydratedDocument<BrainMetrics>;
export const BrainMetricsSchema = SchemaFactory.createForClass(BrainMetrics);
