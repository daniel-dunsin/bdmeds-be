import { IsNumber, IsString } from 'src/shared/decorators';

export class CreateMedicineDto {
   @IsString(false)
   name: string;

   @IsString(false)
   description: string;

   @IsString(false)
   image: string;

   @IsNumber(false)
   stock: number;

   @IsNumber(false)
   amount: number;
}
