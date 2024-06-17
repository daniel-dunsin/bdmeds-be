import { Injectable } from '@nestjs/common';
import { ConsultationService } from '../services/consulation.service';

@Injectable()
export class ConsultationProvider {
   constructor(private readonly consultationService: ConsultationService) {}
}
