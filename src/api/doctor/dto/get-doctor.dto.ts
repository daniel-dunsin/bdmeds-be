import { IsEnum, IsString } from 'src/shared/decorators';
import { Departments } from '../enums';
import { IsBooleanString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetDoctorDto {
   @IsString(true)
   search?: string;

   @IsEnum(Departments, true)
   department: Departments;

   @IsBooleanString()
   @ApiProperty()
   @IsOptional()
   kycVerified?: string;
}
