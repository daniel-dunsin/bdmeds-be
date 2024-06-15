import { Gender } from 'src/api/user/enums';
import { IsString, IsEnum, IsNumber } from 'src/shared/decorators';
import { DoctorSpeciality } from '../enums';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SocialLinks {
   @IsString(false)
   facebook?: string;

   @IsString(false)
   whatsapp?: string;

   @IsString(false)
   twitter: string;

   @IsString(false)
   linkedin?: string;
}

export class UpdateDoctorDto {
   @IsString(true)
   firstName?: string;

   @IsString(true)
   lastName?: string;

   @IsString(true)
   country?: string;

   @IsEnum(Gender, true)
   gender?: Gender;

   @IsNumber(true)
   yearsOfExperience?: number;

   @IsEnum(DoctorSpeciality, true)
   speciality?: DoctorSpeciality;

   @ApiProperty({ type: SocialLinks })
   @ValidateNested()
   @Type(() => SocialLinks)
   socials: SocialLinks;
}
