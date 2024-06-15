import { Injectable, NotFoundException } from '@nestjs/common';
import { PatientService } from './patient.service';

@Injectable()
export class PatientProvider {
   constructor(private readonly patientService: PatientService) {}

   async getUserPatient(userId: string) {
      const data = await this.patientService.getPatient({ user: userId });

      if (!data) {
         throw new NotFoundException('Patient not found');
      }

      return {
         success: true,
         message: 'Patient profile fetched',
         data,
      };
   }

   async getPatient(patientId: string) {
      const data = await this.patientService.getPatient({ _id: patientId });

      if (!data) {
         throw new NotFoundException('Patient not found');
      }

      return {
         success: true,
         message: 'Patient profile fetched',
         data,
      };
   }
}
