import { Module } from '@nestjs/common';
import { DiagnosisProvider } from './diagnosis.provider';
import { DiagnosisService } from './diagnosis.service';
import { DiagnosisController } from './diagnosis.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BoneMetrics, BoneMetricsSchema } from './schemas/bone.schema';
import { BrainMetrics, BrainMetricsSchema } from './schemas/brain.schema';
import { EyesMetrics, EyesMetricsSchema } from './schemas/eyes.schema';
import { HeartMetrics, HeartMetricsSchema } from './schemas/heart.schema';
import { KidneyMetrics, KidneyMetricsSchema } from './schemas/kidney.schema';
import { LiverMetrics, LiverMetricsSchema } from './schemas/liver.schema';
import { SkinMetrics, SkinMetricsSchema } from './schemas/skin.schema';
import { TeethMetrics, TeethMetricsSchema } from './schemas/teeth.schema';
import { Consultation } from '../appointment/schemas/consultation.schema';

@Module({
   imports: [
      MongooseModule.forFeatureAsync([
         {
            name: BoneMetrics.name,
            useFactory() {
               const schema = BoneMetricsSchema;

               schema.virtual('consulation', {
                  ref: Consultation.name,
                  localField: '_id',
                  foreignField: 'diagnosis',
                  justOne: false,
               });

               return schema;
            },
         },
         {
            name: BrainMetrics.name,
            useFactory() {
               const schema = BrainMetricsSchema;

               schema.virtual('consulation', {
                  ref: Consultation.name,
                  localField: '_id',
                  foreignField: 'diagnosis',
                  justOne: false,
               });

               return schema;
            },
         },
         {
            name: EyesMetrics.name,
            useFactory() {
               const schema = EyesMetricsSchema;

               schema.virtual('consulation', {
                  ref: Consultation.name,
                  localField: '_id',
                  foreignField: 'diagnosis',
                  justOne: false,
               });

               return schema;
            },
         },
         {
            name: HeartMetrics.name,
            useFactory() {
               const schema = HeartMetricsSchema;

               schema.virtual('consulation', {
                  ref: Consultation.name,
                  localField: '_id',
                  foreignField: 'diagnosis',
                  justOne: false,
               });

               return schema;
            },
         },
         {
            name: KidneyMetrics.name,
            useFactory() {
               const schema = KidneyMetricsSchema;

               schema.virtual('consulation', {
                  ref: Consultation.name,
                  localField: '_id',
                  foreignField: 'diagnosis',
                  justOne: false,
               });

               return schema;
            },
         },
         {
            name: LiverMetrics.name,
            useFactory() {
               const schema = LiverMetricsSchema;

               schema.virtual('consulation', {
                  ref: Consultation.name,
                  localField: '_id',
                  foreignField: 'diagnosis',
                  justOne: false,
               });

               return schema;
            },
         },
         {
            name: SkinMetrics.name,
            useFactory() {
               const schema = SkinMetricsSchema;

               schema.virtual('consulation', {
                  ref: Consultation.name,
                  localField: '_id',
                  foreignField: 'diagnosis',
                  justOne: false,
               });

               return schema;
            },
         },
         {
            name: TeethMetrics.name,
            useFactory() {
               const schema = TeethMetricsSchema;

               schema.virtual('consulation', {
                  ref: Consultation.name,
                  localField: '_id',
                  foreignField: 'diagnosis',
                  justOne: false,
               });

               return schema;
            },
         },
      ]),
   ],
   providers: [DiagnosisProvider, DiagnosisService],
   controllers: [DiagnosisController],
   exports: [DiagnosisService],
})
export class DiagnosisModule {}
