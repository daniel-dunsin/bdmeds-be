import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, Roles } from 'src/shared/decorators/auth.decorators';
import { UserDocument } from '../user/schema/user.schema';
import { BookSessionDto } from './dto/book-appointment.dto';
import { AppointmentProvider } from './appointment.provider';
import { RoleNames } from '../user/enums';

@Controller('appointment')
@ApiTags('appointment')
@ApiBearerAuth()
export class AppointmentController {
   constructor(private readonly appointmentProvider: AppointmentProvider) {}

   @Post('/:doctorId/book')
   @Roles([RoleNames.DOCTOR])
   async bookSession(
      @Auth() user: UserDocument,
      @Param('doctorId') doctorId: string,
      @Body() bookSessionDto: BookSessionDto,
   ) {
      const data = await this.appointmentProvider.bookSession(bookSessionDto, doctorId, user);

      return data;
   }

   @Get('/doctor/:doctorId')
   async getDoctorAppointments(@Param('doctorId') doctorId: string) {
      const data = await this.appointmentProvider.getDoctorAppointments(doctorId);

      return data;
   }

   @Get('/doctor/user')
   @Roles([RoleNames.PATIENT])
   async getUserDoctorAppointments(@Auth('_id') userId: string) {
      const data = await this.appointmentProvider.getUserDoctorAppointments(userId);

      return data;
   }
}
