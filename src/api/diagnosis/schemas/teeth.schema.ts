import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Consultation, ConsultationDocument } from 'src/api/appointment/schemas/consultation.schema';
import { Patient, PatientDocument } from 'src/api/patient/schema/patient.schema';
import { schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class TeethMetrics {
   @Prop({
      type: Types.ObjectId,
      required: true,
      ref: Patient.name,
   })
   patient: PatientDocument;

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

   @Prop({
      type: Types.ObjectId,
      required: false,
      ref: 'Consultation',
   })
   consultation?: ConsultationDocument;
}

export type TeethMetricsDocument = HydratedDocument<TeethMetrics>;
export const TeethMetricsSchema = SchemaFactory.createForClass(TeethMetrics);
