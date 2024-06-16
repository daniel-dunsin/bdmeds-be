import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PatientDocument } from 'src/api/patient/schema/patient.schema';
import { schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class LiverMetrics {
   @Prop({
      type: Types.ObjectId,
      required: true,
   })
   patient: PatientDocument | string;
}

export type LiverMetricsDocument = HydratedDocument<LiverMetrics>;
export const LiverMetricsSchema = SchemaFactory.createForClass(LiverMetrics);
