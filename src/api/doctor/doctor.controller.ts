import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DoctorProvider } from './doctor.provider';

@Controller('/doctor')
@ApiTags('/doctor')
export class DoctorController {
   constructor(private readonly doctorProvider: DoctorProvider) {}
}
