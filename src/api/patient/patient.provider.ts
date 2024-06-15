import { Injectable, NotFoundException } from '@nestjs/common';
import { PatientService } from './patient.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class PatientProvider {
   constructor(
      private readonly patientService: PatientService,
      private readonly userService: UserService,
   ) {}

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

   async updatePatient(updatePatientDto: UpdatePatientDto, userId: string) {
      const data = await this.patientService.updatePatient(
         { user: userId },
         updatePatientDto,
      );

      await this.userService.updateUser({ _id: userId }, updatePatientDto);

      if (!data) {
         throw new NotFoundException('Patient not found');
      }

      return {
         success: true,
         message: 'Patient porifle updated',
         data,
      };
   }
}
