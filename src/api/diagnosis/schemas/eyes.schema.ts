import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PatientDocument } from 'src/api/patient/schema/patient.schema';
import { schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class EyesMetrics {
   @Prop({
      type: Types.ObjectId,
      required: true,
   })
   patient: PatientDocument | string;

   @Prop()
   visionTestResult: string; // Visual acuity (e.g., 20/20)

   @Prop()
   ocularPressure: number; // mmHg

   @Prop()
   contactLensBaseCurve: number; // Millimeters (mm)

   @Prop()
   contactLensDiameter: number; // Millimeters (mm)
}

export type EyesMetricsDocument = HydratedDocument<EyesMetrics>;
export const EyesMetricsSchema = SchemaFactory.createForClass(EyesMetrics);
