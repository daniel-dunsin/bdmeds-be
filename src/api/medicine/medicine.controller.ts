import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { MedicineProvider } from './medicine.provider';
import { GetMedicineDto } from './dto/get-medicine.dto';
import { IsPublic, Roles } from 'src/shared/decorators/auth.decorators';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { RoleNames } from '../user/enums';

@Controller('medicine')
@ApiTags('medicine')
@ApiBearerAuth()
export class MedicineController {
   constructor(private readonly medicineProvider: MedicineProvider) {}

   @Post()
   @Roles([RoleNames.ADMIN])
   async createMedicine(@Body() createMedicineDto: CreateMedicineDto) {
      const data = await this.medicineProvider.createMedicine(createMedicineDto);

      return data;
   }

   @Get()
   @IsPublic()
   async getMedicines(@Query() query: GetMedicineDto) {
      const data = await this.medicineProvider.getMedicines(query);

      return data;
   }

   @Get(':medicineId')
   @IsPublic()
   async getMedicine(@Param('medicineId') medicineId: string) {
      const data = await this.medicineProvider.getMedicine(medicineId);

      return data;
   }

   @Put(':medicineId')
   @Roles([RoleNames.ADMIN])
   async updateMedicine(
      @Param('medicineId') medicineId: string,
      @Body() updateMedicineDto: UpdateMedicineDto,
   ) {
      const data = await this.medicineProvider.updateMedicine(updateMedicineDto, medicineId);

      return data;
   }

   @Delete(':medicineId')
   @Roles([RoleNames.ADMIN])
   async deleteMedicine(@Param('medicineId') medicineId: string) {
      const data = await this.medicineProvider.deleteMedicine(medicineId);

      return data;
   }
}
