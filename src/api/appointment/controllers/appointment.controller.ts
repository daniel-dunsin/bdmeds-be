import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, Roles } from 'src/shared/decorators/auth.decorators';
import { UserDocument } from '../../user/schema/user.schema';
import { BookSessionDto, SessionDto } from '../dto/book-appointment.dto';
import { AppointmentProvider } from '../providers/appointment.provider';
import { RoleNames } from '../../user/enums';
import { MongoIdPipe } from 'src/core/pipes';

@Controller('appointment')
@ApiTags('appointment')
@ApiBearerAuth()
export class AppointmentController {
   constructor(private readonly appointmentProvider: AppointmentProvider) {}

   @Post('/:doctorId/book')
   @Roles([RoleNames.DOCTOR, RoleNames.PATIENT])
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

   @Get('/user')
   @Roles([RoleNames.PATIENT, RoleNames.DOCTOR])
   async getUserAppointments(@Auth() user: UserDocument) {
      const data = await this.appointmentProvider.getUserAppointments(user);

      return data;
   }

   @Put('/:appointmentId/reschedule')
   @Roles([RoleNames.DOCTOR, RoleNames.PATIENT])
   async rescheduleAppointment(
      @Body() sessionDto: SessionDto,
      @Param('appointmentId') appointmentId: string,
      @Auth() user: UserDocument,
   ) {
      const data = await this.appointmentProvider.rescheduleAppointment(sessionDto, appointmentId, user);

      return data;
   }

   @Put('/:appointmentId/cancel')
   @Roles([RoleNames.DOCTOR, RoleNames.PATIENT])
   async cancelAppointment(@Param('appointmentId') appointmentId: string, @Auth() user: UserDocument) {
      const data = await this.appointmentProvider.cancelAppointment(appointmentId, user);

      return data;
   }

   @Get('/:appointmentId')
   async getAppointment(@Param('appointmentId') appointmentId: string) {
      const data = await this.appointmentProvider.getAppointment(appointmentId);

      return data;
   }
}
