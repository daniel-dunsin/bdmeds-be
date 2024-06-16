import { IsDate, IsEnum } from 'src/shared/decorators';
import { AppointmentMode } from '../enums';
import { Departments } from 'src/api/doctor/enums';

export class SessionDto {
   @IsDate(false)
   appointmentDate: Date;

   @IsDate(false)
   startTime: Date;

   @IsDate(false)
   endTime: Date;
}

export class BookSessionDto extends SessionDto {
   @IsEnum(AppointmentMode, false)
   mode: AppointmentMode;
}
