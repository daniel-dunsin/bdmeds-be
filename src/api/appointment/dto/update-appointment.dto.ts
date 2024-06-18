import { IsEnum } from 'src/shared/decorators';
import { AppointmentStatus } from '../enums';

export class UpdateAppointmentStatusDto {
   @IsEnum(AppointmentStatus, false)
   status: AppointmentStatus;
}
