import { IsDate, IsEnum } from 'src/shared/decorators';
import { AppointmentMode } from '../enums';

export class BookSessionDto {
   @IsDate(false)
   appointmentDate: Date;

   @IsDate(false)
   startTime: Date;

   @IsDate(false)
   endTime: Date;

   @IsEnum(AppointmentMode, false)
   mode: AppointmentMode;
}
