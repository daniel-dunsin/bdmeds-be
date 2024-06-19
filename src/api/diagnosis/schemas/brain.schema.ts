import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Consultation, ConsultationDocument } from 'src/api/appointment/schemas/consultation.schema';
import { Patient, PatientDocument } from 'src/api/patient/schema/patient.schema';
import { schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class BrainMetrics {
   @Prop({
      type: Types.ObjectId,
      required: true,
      ref: Patient.name,
   })
   patient: PatientDocument;

   // description
   @Prop()
   brainHealthStatus: string;

   // Hertz(Hz)
   @Prop()
   eegResults: number;

   // Points (Pts)
   @Prop({
      type: {
         lower: {
            type: Number,
         },
         upper: {
            type: Number,
         },
      },
      required: false,
   })
   cognitiveFunctionTestScore: {
      lower: number;
      upper: number;
   };

   @Prop({
      type: Types.ObjectId,
      required: false,
      ref: 'Consultation',
   })
   consultation?: ConsultationDocument;
}

export type BrainMetricsDocument = HydratedDocument<BrainMetrics>;
export const BrainMetricsSchema = SchemaFactory.createForClass(BrainMetrics);
