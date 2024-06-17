import { Injectable } from '@nestjs/common';
import { ConsultationService } from '../services/consulation.service';
import { AppointmentService } from '../services/appointment.service';

@Injectable()
export class ConsultationProvider {
   constructor(
      private readonly consultationService: ConsultationService,
      private readonly appointmentService: AppointmentService,
   ) {}
}
