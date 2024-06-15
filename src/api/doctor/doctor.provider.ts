import { Injectable, NotFoundException } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Types } from 'mongoose';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class DoctorProvider {
   constructor(
      private readonly doctorService: DoctorService,
      private readonly userService: UserService,
   ) {}

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

   async updateDoctor(userId: string, updateDoctorDto: UpdateDoctorDto) {
      const data = await this.doctorService.updateDoctor(
         { user: userId },
         updateDoctorDto,
      );

      if (!data) throw new NotFoundException('Doctor not found');
      await this.userService.updateUser({ _id: userId }, updateDoctorDto);

      return {
         success: true,
         message: 'Doctor Profile Updated',
         data,
      };
   }

   async uploadKycDocuments() {}
}
