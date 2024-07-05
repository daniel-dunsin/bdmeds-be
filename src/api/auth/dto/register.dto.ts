import { MinLength } from 'class-validator';
import { DoctorSpeciality } from 'src/api/doctor/enums';
import { Gender, RoleNames } from 'src/api/user/enums';
import { IsEmail, IsEnum, IsNumber, IsString } from 'src/shared/decorators';

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

   role: RoleNames;
}

export class OnBoardPatientDto extends RegisterDto {}

export class OnBoardDoctorDto extends RegisterDto {
   @IsNumber(false)
   yearsOfExperience: number;

   @IsEnum(DoctorSpeciality, false)
   speciality: DoctorSpeciality;

   @IsNumber(false)
   chargePerSession: number;
}

export class OnBoardAdminDto extends RegisterDto {}
