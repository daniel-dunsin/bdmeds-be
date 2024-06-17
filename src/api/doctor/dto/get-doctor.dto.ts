import { IsEnum, IsString } from 'src/shared/decorators';
import { Departments } from '../enums';

export class GetDoctorDto {
   @IsString(false)
   search?: string;

   @IsEnum(Departments, false)
   department: Departments;
}
