import { Module } from '@nestjs/common';
import { PatientProvider } from './patient.provider';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from './schema/patient.schema';

@Module({
   imports: [
      MongooseModule.forFeatureAsync([
         {
            name: Patient.name,
            useFactory() {
               const schema = PatientSchema;

               return schema;
            },
         },
      ]),
   ],
   providers: [PatientProvider, PatientService],
   controllers: [PatientController],
})
export class PatientModule {}
