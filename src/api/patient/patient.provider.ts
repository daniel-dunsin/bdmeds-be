import { Injectable, NotFoundException } from '@nestjs/common';
import { PatientService } from './patient.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UserService } from '../user/user.service';
import { DoctorDocument } from '../doctor/schema/doctor.schema';
import { Types } from 'mongoose';

@Injectable()
export class PatientProvider {
   constructor(
      private readonly patientService: PatientService,
      private readonly userService: UserService,
   ) {}

   async getUserPatient(userId: string) {
      const data = await this.patientService.getPatient({
         user: new Types.ObjectId(userId),
      });

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
         { user: new Types.ObjectId(userId) },
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

   async addFavDoc(doctorId: string, userId: string) {
      const data = await this.patientService.getPatient({
         user: new Types.ObjectId(userId),
      });

      if (!data) throw new NotFoundException('Patient not found');
      if (!data.favouriteDoctors.find((doc: DoctorDocument) => String(doc._id) === String(doctorId))) {
         data.favouriteDoctors.push(doctorId);
         await data.save();
      }

      return {
         success: true,
         message: 'doctor added to favourites',
      };
   }

   async removeFavDoc(doctorId: string, userId: string) {
      const data = await this.patientService.getPatient({
         user: new Types.ObjectId(userId),
      });

      if (!data) throw new NotFoundException('Patient not found');
      data.favouriteDoctors = data.favouriteDoctors.filter(
         (doc: DoctorDocument) => String(doc._id) === String(doctorId),
      );
      await data.save();

      return {
         success: true,
         message: 'doctor removed from favourites',
      };
   }

   async getFavDoctors(patientId: string) {
      const data = await this.patientService.getPatient({ _id: patientId });

      if (!data) throw new NotFoundException('Patient not found');

      return {
         success: true,
         message: 'favourite doctors fetched successfully',
         data: data.favouriteDoctors,
      };
   }

   async getUserFavDoctors(userId: string) {
      const data = await this.patientService.getPatient({
         user: new Types.ObjectId(userId),
      });

      if (!data) throw new NotFoundException('Patient not found');

      return {
         success: true,
         message: 'favourite doctors fetched successfully',
         data: data.favouriteDoctors,
      };
   }
}
