import { Injectable } from '@nestjs/common';
import { PatientService } from './patient.service';

@Injectable()
export class PatientProvider {
   constructor(private readonly patientService: PatientService) {}
}
