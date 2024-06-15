import { Module } from '@nestjs/common';
import { PatientProvider } from './patient.provider';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from './schema/patient.schema';
import { UserModule } from '../user/user.module';

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
      UserModule,
   ],
   providers: [PatientProvider, PatientService],
   controllers: [PatientController],
   exports: [PatientService],
})
export class PatientModule {}
