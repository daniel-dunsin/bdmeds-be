import { MinLength } from 'class-validator';
import { Gender } from 'src/api/user/enums';
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
}
