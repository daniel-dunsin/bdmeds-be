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
import { DiagnosisModule } from '../diagnosis/diagnosis.module';
import { AppointmentStatus } from './enums';
import { ZoomModule } from 'src/shared/zoom/zoom.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentModule } from '../payment/payment.module';

@Module({
   imports: [
      MongooseModule.forFeatureAsync([
         {
            name: Appointment.name,
            useFactory() {
               const schema = AppointmentSchema;
               schema.pre('save', function () {
                  if (this.isModified('patientStatus') || this.isModified('doctorStatus')) {
                     if (
                        this.patientStatus === AppointmentStatus.SUCCESSFUL &&
                        this.doctorStatus === AppointmentStatus.SUCCESSFUL
                     ) {
                        this.status === AppointmentStatus.SUCCESSFUL;
                     } else if (
                        this.patientStatus === AppointmentStatus.FAILED &&
                        this.doctorStatus === AppointmentStatus.FAILED
                     ) {
                        this.status === AppointmentStatus.FAILED;
                     }
                  }

                  return;
               });
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
      ScheduleModule.forRoot(),
      DoctorModule,
      PatientModule,
      SharedModule,
      DiagnosisModule,
      ZoomModule,
      PaymentModule,
   ],
   controllers: [AppointmentController, ConsultationController],
   providers: [AppointmentService, AppointmentProvider, ConsultationProvider, ConsultationService],
   exports: [AppointmentService],
})
export class AppointmentModule {}
