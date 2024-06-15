import { MinLength } from 'class-validator';
import { DoctorSpeciality } from 'src/api/doctor/enums';
import { Gender, Roles } from 'src/api/user/enums';
import { IsEmail, IsEnum, IsString } from 'src/shared/decorators';

export class RegisterDto {
   @IsEmail(false)
   email: string;

   @IsString(false)
   firstName: string;

   @IsString(false)
   lastName: string;

   @IsString(false)
   phoneNumber: string;

   @IsString(false)
   @MinLength(6)
   password: string;

   @IsEnum(Gender, false)
   gender: Gender;

   role: Roles;
}

export class OnBoardPatientDto extends RegisterDto {}

export class OnBoardDoctorDto extends RegisterDto {
   yearsOfExperience: number;
   speciality: DoctorSpeciality;
}
