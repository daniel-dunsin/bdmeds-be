import { Gender } from 'src/api/user/enums';
import { IsString, IsEnum, IsNumber, IsDate } from 'src/shared/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Address {
   @IsString(false)
   state: string;

   @IsString(false)
   city: string;

   @IsString(false)
   country: string;
}

export class BaseUpdateUserDto {
   @IsString(true)
   firstName?: string;

   @IsString(true)
   lastName?: string;

   @IsString(true)
   country?: string;

   @IsEnum(Gender, true)
   gender?: Gender;

   @ApiProperty({ type: Address })
   @IsOptional()
   @ValidateNested()
   address: Address;
}
