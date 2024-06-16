import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PatientDocument } from 'src/api/patient/schema/patient.schema';
import { schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class SkinMetrics {
   @Prop({
      type: Types.ObjectId,
      required: true,
   })
   patient: PatientDocument | string;

   @Prop()
   skinHealthStatus: string; // Descriptive

   @Prop()
   lesionCount: number; // Count

   @Prop()
   lesionSize: number; // Millimeters (mm)

   @Prop()
   allergyTestResults: number; // Millimeters (mm)

   @Prop()
   biopsyResults: string; // Descriptive
}

export type SkinMetricsDocument = HydratedDocument<SkinMetrics>;
export const SkinMetricsSchema = SchemaFactory.createForClass(SkinMetrics);
