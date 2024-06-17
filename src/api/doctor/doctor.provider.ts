import { Injectable, NotFoundException } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { FilterQuery, Types } from 'mongoose';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { UserService } from '../user/user.service';
import { KycDocsDto } from './dto/kyc-verification.dto';
import { UtilService } from 'src/shared/services/utils.service';
import { FileService } from 'src/shared/file/file.service';
import { KycStatus } from './enums';
import { MailService } from 'src/shared/mail/mail.service';
import { GetKycDto } from './dto/get-kyc.dto';
import { KycVerificationDocument } from './schema/kyc-verification.schema';
import { GetDoctorDto } from './dto/get-doctor.dto';
import { DoctorDocument } from './schema/doctor.schema';

@Injectable()
export class DoctorProvider {
   constructor(
      private readonly doctorService: DoctorService,
      private readonly userService: UserService,
      private readonly fileService: FileService,
      private readonly mailService: MailService,
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
         { user: new Types.ObjectId(userId) },
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
      const doctor = await this.doctorService.getDoctor({
         user: new Types.ObjectId(userId),
      });
      if (!doctor) throw new NotFoundException('Doctor profile not found');
      if (doctor.kycVerified) throw new NotFoundException('Your Kyc info has been verified');

      const { url: idDoc, public_id: idDocPublicId } = await this.fileService.uploadResource(
         updateKycDto.idDoc,
      );

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
            status: KycStatus.PENDING,
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

   async verifyDoctorKyc(doctorId: string) {
      const data = await this.doctorService.updateDoctor({ _id: doctorId }, { kycVerified: true });

      await this.doctorService.updateKyc({ status: KycStatus.SUCCESSFUL }, doctorId);

      await this.mailService.sendMail({
         to: data.user.email,
         subject: 'BDMeds: KYC Verification Successful',
         template: 'kyc-verification-successful',
         context: {
            firstName: data.user?.firstName,
         },
      });

      return {
         success: true,
         message: 'Kyc Verified',
      };
   }

   async rejectDoctorKyc(doctorId: string) {
      const data = await this.doctorService.updateDoctor({ _id: doctorId }, { kycVerified: false });
      await this.doctorService.updateKyc({ status: KycStatus.FAILED }, doctorId);

      await this.mailService.sendMail({
         to: data.user.email,
         subject: 'BDMeds: KYC Verification Failed',
         template: 'kyc-verification-failed',
         context: {
            firstName: data.user?.firstName,
         },
      });

      return {
         success: true,
         message: 'Kyc Rejected',
      };
   }

   async getKycs(query: GetKycDto) {
      const _query: FilterQuery<KycVerificationDocument> = {};

      if (query.status) {
         _query.status = query.status;
         delete query.status;
      }

      const data = await this.doctorService.getKycs(_query);

      return {
         success: true,
         message: 'Kycs fetched',
         data,
      };
   }

   async getDoctors(query: GetDoctorDto) {
      const _query: FilterQuery<DoctorDocument> = {};

      if (query.search) {
         _query.search = query.search;
         delete query.search;
      }

      if (query.department) {
         _query.department = query.department;
         delete query.department;
      }

      const data = await this.doctorService.getDoctors(_query);

      return {
         success: true,
         message: 'doctors fetched',
         data,
      };
   }
}
