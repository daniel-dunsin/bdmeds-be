import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DoctorProvider } from './doctor.provider';
import { Auth, IsPublic } from 'src/shared/decorators/auth.decorators';
import { MongoIdPipe } from 'src/core/pipes';
import { DoctorSpeciality } from './enums';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { KycDocsDto } from './dto/kyc-verification.dto';

@Controller('/doctor')
@ApiTags('doctor')
@ApiBearerAuth()
export class DoctorController {
   constructor(private readonly doctorProvider: DoctorProvider) {}

   @Get('/user')
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

   @Put('/kyc/verify')
   async verifyKycInfo(
      @Auth('_id') userId: string,
      @Body() updateKycDto: KycDocsDto,
   ) {
      const data = await this.doctorProvider.updateKycDocuments(
         updateKycDto,
         userId,
      );

      return data;
   }
}
