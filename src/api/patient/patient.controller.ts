import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatientProvider } from './patient.provider';
import { Auth, Roles } from 'src/shared/decorators/auth.decorators';
import { MongoIdPipe } from 'src/core/pipes';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { RoleNames } from '../user/enums';

@Controller('patient')
@ApiTags('patient')
@ApiBearerAuth()
export class PatientController {
   constructor(private readonly patientProvider: PatientProvider) {}

   @Get('/user')
   @Roles([RoleNames.PATIENT])
   async getUserPatient(@Auth('_id') userId: string) {
      console.log(userId);
      const data = await this.patientProvider.getUserPatient(userId);

      return data;
   }

   @Get(':patientId')
   async getPatient(@Param('patientId', MongoIdPipe) patientId: string) {
      const data = await this.patientProvider.getPatient(patientId);

      return data;
   }

   @Put()
   @Roles([RoleNames.PATIENT])
   async updatePatient(@Auth('_id') userId: string, @Body() updatePatientDto: UpdatePatientDto) {
      const data = await this.patientProvider.updatePatient(updatePatientDto, userId);

      return data;
   }

   @Post('/favourite/doctor/:doctorId')
   @Roles([RoleNames.PATIENT])
   async addFavDoc(@Auth('_id') userId: string, @Param('doctorId') doctorId: string) {
      const data = await this.patientProvider.addFavDoc(doctorId, userId);

      return data;
   }

   @Delete('/favourite/doctor/:doctorId')
   @Roles([RoleNames.PATIENT])
   async removeFavDoc(@Auth('_id') userId: string, @Param('doctorId') doctorId: string) {
      const data = await this.patientProvider.removeFavDoc(doctorId, userId);

      return data;
   }

   @Get('/user/favourite/doctor')
   @Roles([RoleNames.PATIENT])
   async getUserPatientFavDocs(@Auth('_id') userId: string) {
      const data = await this.patientProvider.getUserFavDoctors(userId);

      return data;
   }

   @Get('/:patientId/favourite/doctor')
   async getPatientFavDocs(@Param('patientId') patientId: string) {
      const data = await this.patientProvider.getFavDoctors(patientId);

      return data;
   }
}
