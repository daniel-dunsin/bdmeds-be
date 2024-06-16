import { Gender } from 'src/api/user/enums';
import {
   IsString,
   IsEnum,
   IsNumber,
   IsDate,
   IsBoolean,
} from 'src/shared/decorators';
import { Days, DoctorSpeciality } from '../enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseUpdateUserDto } from 'src/api/user/dto/update-user.dto';

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

export class UpdateDoctorDto extends BaseUpdateUserDto {
   @IsString(true)
   bio: string;

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

   @IsBoolean(true)
   isAvailable: boolean;
}
