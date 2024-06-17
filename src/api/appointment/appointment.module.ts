import { Module } from '@nestjs/common';
import { AppointmentController } from './controllers/appointment.controller';
import { AppointmentService } from './services/appointment.service';
import { AppointmentProvider } from './providers/appointment.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientModule } from '../patient/patient.module';
import { SharedModule } from 'src/shared/shared.module';
import { Consultation, ConsultationSchema } from './schemas/consultation.schema';
import { ConsultationController } from './controllers/consulation.controller';
import { ConsultationProvider } from './providers/consultation.provider';
import { ConsultationService } from './services/consulation.service';

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
         {
            name: Consultation.name,
            useFactory() {
               const schema = ConsultationSchema;
               return schema;
            },
         },
      ]),
      DoctorModule,
      PatientModule,
      SharedModule,
   ],
   controllers: [AppointmentController, ConsultationController],
   providers: [AppointmentService, AppointmentProvider, ConsultationProvider, ConsultationService],
})
export class AppointmentModule {}
