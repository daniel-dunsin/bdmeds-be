import { IsEnum, IsString } from 'src/shared/decorators';
import { Departments } from '../enums';

export class GetDoctorDto {
   @IsString(true)
   search?: string;

   @IsEnum(Departments, true)
   department: Departments;
}
