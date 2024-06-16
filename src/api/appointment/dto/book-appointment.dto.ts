import { IsDate } from 'src/shared/decorators';
import { AppointmentMode } from '../enums';

export class BookSessionDto {
   @IsDate(false)
   appointmentDate: Date;

   @IsDate(false)
   startTime: Date;

   @IsDate(false)
   endTime: Date;
}

export class BookPhysicalSessionDto extends BookSessionDto {}

export class BookOnlineSessionDto extends BookSessionDto {}
