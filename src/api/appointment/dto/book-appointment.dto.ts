import { IsDate, IsEnum } from 'src/shared/decorators';
import { AppointmentMode } from '../enums';
import { Departments } from 'src/api/doctor/enums';

export class BookSessionDto {
   @IsDate(false)
   appointmentDate: Date;

   @IsDate(false)
   startTime: Date;

   @IsDate(false)
   endTime: Date;

   @IsEnum(AppointmentMode, false)
   mode: AppointmentMode;

   @IsEnum(Departments, false)
   department: Departments;
}
