import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PatientProvider } from './patient.provider';

@Controller('patient')
@ApiTags('patient')
export class PatientController {
   constructor(private readonly patientProvider: PatientProvider) {}
}
