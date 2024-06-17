import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PatientDocument } from 'src/api/patient/schema/patient.schema';
import { schemaOptions } from 'src/shared/constants/db.const';
import { Frequency } from '../enums';

@Schema(schemaOptions)
export class KidneyMetrics {
   @Prop({
      type: Types.ObjectId,
      required: true,
   })
   patient: PatientDocument | string;

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
}

export type KidneyMetricsDocument = HydratedDocument<KidneyMetrics>;
export const KidneyMetricsSchema = SchemaFactory.createForClass(KidneyMetrics);
