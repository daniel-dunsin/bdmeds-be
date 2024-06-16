import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, Roles } from 'src/shared/decorators/auth.decorators';
import { UserDocument } from '../user/schema/user.schema';
import { BookSessionDto } from './dto/book-appointment.dto';
import { AppointmentProvider } from './appointment.provider';
import { RoleNames } from '../user/enums';
import { MongoIdPipe } from 'src/core/pipes';

@Controller('appointment')
@ApiTags('appointment')
@ApiBearerAuth()
export class AppointmentController {
   constructor(private readonly appointmentProvider: AppointmentProvider) {}

   @Post('/:doctorId/book')
   @Roles([RoleNames.DOCTOR])
   async bookSession(
      @Auth() user: UserDocument,
      @Param('doctorId', MongoIdPipe) doctorId: string,
      @Body() bookSessionDto: BookSessionDto,
   ) {
      const data = await this.appointmentProvider.bookSession(bookSessionDto, doctorId, user);

      return data;
   }

   @Get('/doctor/:doctorId')
   async getDoctorAppointments(@Param('doctorId', MongoIdPipe) doctorId: string) {
      const data = await this.appointmentProvider.getDoctorAppointments(doctorId);

      return data;
   }

   @Get('/doctor/user')
   @Roles([RoleNames.DOCTOR])
   async getUserDoctorAppointments(@Auth('_id') userId: string) {
      const data = await this.appointmentProvider.getUserDoctorAppointments(userId);

      return data;
   }

   @Get('/patient/:patientId')
   async getPatientAppointments(@Param('patientId', MongoIdPipe) patientId: string) {
      const data = await this.appointmentProvider.getPatientAppointments(patientId);

      return data;
   }

   @Get('/patient/user')
   @Roles([RoleNames.PATIENT])
   async getUserPatientAppointments(@Auth('_id') userId: string) {
      const data = await this.appointmentProvider.getUserPatientAppointments(userId);

      return data;
   }
}
