import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { AppointmentModule } from './appointment/appointment.module';
import { VideoModule } from './video/video.module';

@Module({
   imports: [
      DatabaseModule,
      UserModule,
      AuthModule,
      TokenModule,
      DoctorModule,
      PatientModule,
      DiagnosisModule,
      AppointmentModule,
      VideoModule,
   ],
})
export class ApiModule {}
