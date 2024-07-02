import { IsNumber, IsString } from 'src/shared/decorators';
import { PaginationQuery } from 'src/shared/interfaces/pagination.interface';

export class GetMedicineDto implements PaginationQuery {
   @IsNumber(true)
   page: number;

   @IsNumber(true)
   limit: number;

   @IsString(true)
   search: string;
}
