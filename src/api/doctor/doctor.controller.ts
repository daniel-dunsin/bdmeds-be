import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DoctorProvider } from './doctor.provider';
import { Auth, IsPublic, Roles } from 'src/shared/decorators/auth.decorators';
import { MongoIdPipe } from 'src/core/pipes';
import { DoctorSpeciality, KycIdType } from './enums';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { KycDocsDto } from './dto/kyc-verification.dto';
import { RoleNames } from '../user/enums';

@Controller('/doctor')
@ApiTags('doctor')
@ApiBearerAuth()
export class DoctorController {
   constructor(private readonly doctorProvider: DoctorProvider) {}

   @Get('/user')
   @Roles([RoleNames.DOCTOR])
   async getUserDoctor(@Auth('_id') userId: string) {
      const data = await this.doctorProvider.getUserDoctor(userId);

      return data;
   }

   @Get('/specialities')
   @ApiOperation({ summary: 'get list of specializations' })
   @IsPublic()
   async getSpecialities() {
      return {
         success: true,
         message: 'specialities fetched',
         data: Object.values(DoctorSpeciality),
      };
   }

   @Put()
   @Roles([RoleNames.DOCTOR])
   async updateDoctor(
      @Auth('_id') userId: string,
      @Body() updateDoctorDto: UpdateDoctorDto,
   ) {
      const data = await this.doctorProvider.updateDoctor(
         userId,
         updateDoctorDto,
      );

      return data;
   }

   @Get('/:doctorId')
   @IsPublic()
   async getDoctor(@Param('doctorId', MongoIdPipe) doctorId: string) {
      const data = await this.doctorProvider.getDoctor(doctorId);

      return data;
   }

   @Put('/kyc/update')
   @Roles([RoleNames.DOCTOR])
   async updateKycInfo(
      @Auth('_id') userId: string,
      @Body() updateKycDto: KycDocsDto,
   ) {
      const data = await this.doctorProvider.updateKycDocuments(
         updateKycDto,
         userId,
      );

      return data;
   }

   @Get('/:doctorId/kyc')
   @Roles([RoleNames.DOCTOR, RoleNames.ADMIN])
   async getDoctorKyc(@Param('doctorId', MongoIdPipe) doctorId: string) {
      const data = await this.doctorProvider.getDoctorKyc(doctorId);

      return data;
   }

   @Get('/kyc/id-types')
   @IsPublic()
   async getKycIdTypes() {
      return {
         sucess: true,
         message: 'id types fetched',
         data: Object.values(KycIdType),
      };
   }

   @Post('/:doctorId/kyc/verify')
   @Roles([RoleNames.ADMIN])
   async verifyDoctorKyc(@Param('doctorId') doctorId: string) {
      const data = await this.doctorProvider.verifyDoctorKyc(doctorId);

      return data;
   }

   @Post('/:doctorId/kyc/reject')
   @Roles([RoleNames.ADMIN])
   async rejectDoctorKyc(@Param('doctorId') doctorId: string) {
      const data = await this.doctorProvider.rejectDoctorKyc(doctorId);

      return data;
   }
}
