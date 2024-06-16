import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PatientDocument } from 'src/api/patient/schema/patient.schema';
import { schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class TeethMetrics {
   @Prop({
      type: Types.ObjectId,
      required: true,
   })
   patient: PatientDocument | string;

   @Prop()
   dentalHealthStatus: string; // Descriptive

   @Prop()
   cavitiesCount: number; // Count

   @Prop()
   gumRecession: number; // Millimeters (mm)

   @Prop()
   plaqueIndex: number; // Score

   @Prop()
   recentProcedures: string; // Descriptive
}

export type TeethMetricsDocument = HydratedDocument<TeethMetrics>;
export const TeethMetricsSchema = SchemaFactory.createForClass(TeethMetrics);
