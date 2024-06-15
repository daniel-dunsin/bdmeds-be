import { Injectable } from '@nestjs/common';
import { DoctorService } from './doctor.service';

@Injectable()
export class DoctorProvider {
   constructor(private readonly doctorService: DoctorService) {}
}
