import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatientProvider } from './patient.provider';
import { Auth } from 'src/shared/decorators/auth.decorators';
import { MongoIdPipe } from 'src/core/pipes';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller('patient')
@ApiTags('patient')
@ApiBearerAuth()
export class PatientController {
   constructor(private readonly patientProvider: PatientProvider) {}

   @Get('/user')
   async getUserPatient(@Auth('_id') userId: string) {
      const data = await this.patientProvider.getUserPatient(userId);

      return data;
   }

   @Get(':patientId')
   async getPatient(@Param('patientId', MongoIdPipe) patientId: string) {
      const data = await this.patientProvider.getPatient(patientId);

      return data;
   }

   @Put()
   async updatePatient(
      @Auth('_id') userId: string,
      @Body() updatePatientDto: UpdatePatientDto,
   ) {
      const data = await this.patientProvider.updatePatient(
         updatePatientDto,
         userId,
      );

      return data;
   }
}
