import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PatientProvider } from './patient.provider';
import { Auth } from 'src/shared/decorators/auth.decorators';
import { MongoIdPipe } from 'src/core/pipes';

@Controller('patient')
@ApiTags('patient')
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
}
