import { Gender } from 'src/api/user/enums';
import { IsString, IsEnum, IsNumber, IsDate } from 'src/shared/decorators';
import { Days, DoctorSpeciality } from '../enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SocialLinks {
   @IsString(true)
   facebook?: string;

   @IsString(true)
   whatsapp?: string;

   @IsString(true)
   twitter?: string;

   @IsString(true)
   linkedin?: string;
}

export class AvailableDay {
   @IsEnum(Days, false)
   day: Days;

   @IsDate(false)
   startTime: Date;

   @IsDate(false)
   endTime: Date;
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
   @IsOptional()
   socials: SocialLinks;

   @ApiProperty({ type: [AvailableDay] })
   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => AvailableDay)
   @IsOptional()
   availableDays: AvailableDay[];
}
