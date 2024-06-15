import { Gender } from 'src/api/user/enums';
import { IsString, IsEnum, IsNumber } from 'src/shared/decorators';
import { DoctorSpeciality } from '../enums';

export class UpdateDoctorDto {
   @IsString(true)
   firstName?: string;

   @IsString(true)
   lastName?: string;

   @IsEnum(Gender, true)
   gender?: Gender;

   @IsNumber(true)
   yearsOfExperience?: number;

   @IsEnum(DoctorSpeciality, true)
   speciality?: DoctorSpeciality;
}
