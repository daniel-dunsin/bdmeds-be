import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConsultationProvider } from '../providers/consultation.provider';
import {
   CardiologyConsultationReportDto,
   DentistryConsultationReportDto,
   DermatologyConsultationReportDto,
   HepatologyConsultationReportDto,
   NephrologyConsultationReportDto,
   NuerologyConsultationReportDto,
   OptometryConsultationReportDto,
   OrthopedicConsultationReportDto,
} from '../dto/submit-consultation.dto';
import { Auth, Roles } from 'src/shared/decorators/auth.decorators';
import { RoleNames } from 'src/api/user/enums';
import { MongoIdPipe } from 'src/core/pipes';
import { Departments } from 'src/api/doctor/enums';

@Controller('consultation')
@ApiTags('consultation')
@ApiBearerAuth()
export class ConsultationController {
   constructor(private readonly consultationProvider: ConsultationProvider) {}

   @Post('report/:appointmentId/orthopedic')
   @Roles([RoleNames.DOCTOR])
   async createOrthopedicReport(
      @Param('appointmentId', MongoIdPipe) appointmentId: string,
      @Body() orthopedicReportDto: OrthopedicConsultationReportDto,
   ) {
      const data = await this.consultationProvider.createOrthopedicReport(orthopedicReportDto, appointmentId);

      return data;
   }

   @Post('report/:appointmentId/neurology')
   @Roles([RoleNames.DOCTOR])
   async createNuerologyReport(
      @Param('appointmentId', MongoIdPipe) appointmentId: string,
      @Body() neurologyReportDto: NuerologyConsultationReportDto,
   ) {
      const data = await this.consultationProvider.createNeurologyReport(neurologyReportDto, appointmentId);

      return data;
   }

   @Post('report/:appointmentId/optometry')
   @Roles([RoleNames.DOCTOR])
   async createOptometryReport(
      @Param('appointmentId', MongoIdPipe) appointmentId: string,
      @Body() optometryReportDto: OptometryConsultationReportDto,
   ) {
      const data = await this.consultationProvider.createOptometryReport(optometryReportDto, appointmentId);

      return data;
   }

   @Post('report/:appointmentId/cardiology')
   @Roles([RoleNames.DOCTOR])
   async createCardiologyReport(
      @Param('appointmentId', MongoIdPipe) appointmentId: string,
      @Body() cardiologyReportDto: CardiologyConsultationReportDto,
   ) {
      const data = await this.consultationProvider.createCardiologyReport(cardiologyReportDto, appointmentId);

      return data;
   }

   @Post('report/:appointmentId/nephrology')
   @Roles([RoleNames.DOCTOR])
   async createNephrologyReport(
      @Param('appointmentId', MongoIdPipe) appointmentId: string,
      @Body() nephrologyReportDto: NephrologyConsultationReportDto,
   ) {
      const data = await this.consultationProvider.createNephrologyReport(nephrologyReportDto, appointmentId);

      return data;
   }

   @Post('report/:appointmentId/hepatology')
   @Roles([RoleNames.DOCTOR])
   async createHepatologyReport(
      @Param('appointmentId', MongoIdPipe) appointmentId: string,
      @Body() hepatologyReportDto: HepatologyConsultationReportDto,
   ) {
      const data = await this.consultationProvider.createHepatologyReport(hepatologyReportDto, appointmentId);

      return data;
   }

   @Post('report/:appointmentId/dermatology')
   @Roles([RoleNames.DOCTOR])
   async createDermatologyReport(
      @Param('appointmentId', MongoIdPipe) appointmentId: string,
      @Body() dermatologyReportDto: DermatologyConsultationReportDto,
   ) {
      const data = await this.consultationProvider.createDermatologyReport(
         dermatologyReportDto,
         appointmentId,
      );

      return data;
   }

   @Post('report/:appointmentId/dentistry')
   @Roles([RoleNames.DOCTOR])
   async createDentistryReport(
      @Param('appointmentId', MongoIdPipe) appointmentId: string,
      @Body() dentistryReportDto: DentistryConsultationReportDto,
   ) {
      const data = await this.consultationProvider.createDentistryReport(dentistryReportDto, appointmentId);

      return data;
   }

   @Get('report/user/:department')
   @Roles([RoleNames.PATIENT])
   async getUserReports(@Param('department') department: Departments, @Auth('_id') userId: string) {
      const data = await this.consultationProvider.getReports(department, userId);

      return data;
   }

   @Get('report/patient/:patientId/:department')
   async getPatientReports(
      @Param('department') department: Departments,
      @Param('patientId', MongoIdPipe) patientId: string,
   ) {
      const data = await this.consultationProvider.getPatientReports(department, patientId);

      return data;
   }

   @Get('report/:department/:reportId')
   async getReport(
      @Param('department') department: Departments,
      @Auth('reportId', MongoIdPipe) reportId: string,
   ) {
      const data = await this.consultationProvider.getReport(reportId, department);

      return data;
   }
}
