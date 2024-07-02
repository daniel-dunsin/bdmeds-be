import { IsNumber, IsString } from 'src/shared/decorators';

export class UpdateMedicineDto {
   @IsString(true)
   name: string;

   @IsString(true)
   description: string;

   @IsString(true)
   image: string;

   @IsNumber(true)
   stock: number;

   @IsNumber(true)
   amount: number;
}
