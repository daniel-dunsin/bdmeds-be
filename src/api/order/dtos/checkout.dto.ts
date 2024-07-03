import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { IsNumber, IsString } from 'src/shared/decorators';

class CartDto {
   @IsString(false)
   medicine: string;

   @IsNumber(false)
   qty: number;
}

class AddressDto {
   @IsString(false)
   state: string;

   @IsString(false)
   city: string;

   @IsString(false)
   country: string;

   @IsString(false)
   streetAddress: string;
}

export class CheckoutDto {
   @IsString(true)
   orderNotes: string;

   @ApiProperty({ type: [CartDto] })
   @ValidateNested({ each: true })
   @Type(() => CartDto)
   @IsArray()
   cart: CartDto[];

   @ApiProperty({ type: AddressDto })
   @ValidateNested()
   @Type(() => AddressDto)
   address: AddressDto;
}
