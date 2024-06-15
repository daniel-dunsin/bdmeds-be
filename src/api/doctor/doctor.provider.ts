import { Injectable, NotFoundException } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Types } from 'mongoose';

@Injectable()
export class DoctorProvider {
   constructor(private readonly doctorService: DoctorService) {}

   async getUserDoctor(userId: string) {
      const data = await this.doctorService.getDoctor({
         user: new Types.ObjectId(userId),
      });

      if (!data) {
         throw new NotFoundException('Doctor profile not found');
      }

      return {
         success: true,
         message: 'Doctor profile fetched',
         data,
      };
   }

   async getDoctor(doctorId: string) {
      const data = await this.doctorService.getDoctor({ _id: doctorId });

      if (!data) throw new NotFoundException('Doctor not found');

      return {
         success: true,
         message: 'Doctor profile fetched',
         data,
      };
   }

   async updateDoctor(doctorId: string) {}
}
