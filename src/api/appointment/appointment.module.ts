import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentProvider } from './appointment.provider';

@Module({
   controllers: [AppointmentController],
   providers: [AppointmentService, AppointmentProvider],
})
export class AppointmentModule {}
