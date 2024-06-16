import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentProvider } from './appointment.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientModule } from '../patient/patient.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
   imports: [
      MongooseModule.forFeatureAsync([
         {
            name: Appointment.name,
            useFactory() {
               const schema = AppointmentSchema;
               return schema;
            },
         },
      ]),
      DoctorModule,
      PatientModule,
      SharedModule,
   ],
   controllers: [AppointmentController],
   providers: [AppointmentService, AppointmentProvider],
})
export class AppointmentModule {}
