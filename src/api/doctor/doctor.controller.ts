import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DoctorProvider } from './doctor.provider';
import { Auth, IsPublic } from 'src/shared/decorators/auth.decorators';
import { MongoIdPipe } from 'src/core/pipes';

@Controller('/doctor')
@ApiTags('doctor')
export class DoctorController {
   constructor(private readonly doctorProvider: DoctorProvider) {}

   @Get('/user')
   async getUserDoctor(@Auth('_id') userId: string) {
      const data = await this.doctorProvider.getUserDoctor(userId);

      return data;
   }

   @Get('/:doctorId')
   @IsPublic()
   async getDoctor(@Param('doctorId', MongoIdPipe) doctorId: string) {
      const data = await this.doctorProvider.getDoctor(doctorId);

      return data;
   }
}
