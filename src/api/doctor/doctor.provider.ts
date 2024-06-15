import { Injectable, NotFoundException } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Types } from 'mongoose';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { UserService } from '../user/user.service';
import { KycDocsDto } from './dto/kyc-verification.dto';
import { UtilService } from 'src/shared/services/utils.service';
import { FileService } from 'src/shared/services/file.service';

@Injectable()
export class DoctorProvider {
   constructor(
      private readonly doctorService: DoctorService,
      private readonly userService: UserService,
      private readonly fileService: FileService,
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

   async updateKycDocuments(updateKycDto: KycDocsDto, userId: string) {
      const doctor = await this.doctorService.getDoctor({ _id: userId });
      if (!doctor) throw new NotFoundException('Doctor profile not found');
      if (doctor.kycVerified)
         throw new NotFoundException('Your Kyc info has been verified');

      const { url: idDoc, public_id: idDocPublicId } =
         await this.fileService.uploadResource(updateKycDto.idDoc);

      const { url: professionalCert, public_id: professionalCertPublicId } =
         await this.fileService.uploadResource(updateKycDto.professionalCert);

      const kyc = await this.doctorService.getDoctorKyc(doctor._id);

      await this.doctorService.updateKyc(
         {
            idDoc,
            idDocPublicId,
            professionalCert,
            professionalCertPublicId,
            idType: updateKycDto.idType,
         },
         doctor._id,
      );

      if (kyc.idDocPublicId) {
         await this.fileService.deleteResource(kyc.idDocPublicId);
      }
      if (kyc.professionalCertPublicId) {
         await this.fileService.deleteResource(kyc.professionalCertPublicId);
      }

      // send admin notification
      return {
         success: true,
         message: 'Kyc Docs uploaded successfully',
      };
   }

   async getDoctorKyc(doctorId: string) {
      const data = await this.doctorService.getDoctorKyc(doctorId);

      return {
         success: true,
         message: 'kyc info fetched',
         data,
      };
   }
}
