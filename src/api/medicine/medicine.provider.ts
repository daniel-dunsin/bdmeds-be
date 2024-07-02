import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { FileService } from 'src/shared/file/file.service';
import { MedicineService } from './medicine.service';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { GetMedicineDto } from './dto/get-medicine.dto';
import { FilterQuery } from 'mongoose';
import { MedicineDocument } from './schemas/medicine.schema';
import { PaginationQuery } from 'src/shared/interfaces/pagination.interface';

@Injectable()
export class MedicineProvider {
   constructor(
      private readonly fileService: FileService,
      private readonly medicineService: MedicineService,
   ) {}

   async createMedicine(createMedicineDto: CreateMedicineDto) {
      const { url } = await this.fileService.uploadResource(createMedicineDto.image);

      createMedicineDto.image = url;

      const data = await this.medicineService.createMedicine(createMedicineDto);

      return {
         success: true,
         message: 'medicine created successfully',
         data,
      };
   }

   async updateMedicine(updateMedicineDto: UpdateMedicineDto, medicineId: string) {
      if (updateMedicineDto.image) {
         const { url } = await this.fileService.uploadResource(updateMedicineDto.image);

         updateMedicineDto.image = url;
      }

      const data = await this.medicineService.updateMedicine({ _id: medicineId }, updateMedicineDto);

      if (!data) throw new NotFoundException('Medicine not found');

      return {
         success: true,
         message: 'medicine updated successfully',
         data,
      };
   }

   async getMedicine(medicineId: string) {
      const data = await this.medicineService.getMedicine({ _id: medicineId });

      if (!data) throw new NotFoundException('Medicine not found');

      return {
         success: true,
         message: 'medicine fetched successfully',
         data,
      };
   }

   async getMedicines(query: GetMedicineDto) {
      const _query: FilterQuery<MedicineDocument> = {};
      const paginationQuery: Partial<PaginationQuery> = {};

      if (query.search) {
         _query.$or = [
            { name: { $regex: query.search, $options: 'i' } },
            { description: { $regex: query.search, $options: 'i' } },
         ];
         delete query.search;
      }

      if (query.limit) {
         paginationQuery.limit = query.limit;
         delete query.limit;
      }

      if (query.page) {
         paginationQuery.page = query.page;
         delete query.page;
      }

      const { data, page, count, totalPages } = await this.medicineService.getMedicines(
         _query,
         paginationQuery as PaginationQuery,
      );

      return {
         success: true,
         message: 'medicine fetched successfully',
         data,
         meta: {
            page,
            count,
            totalPages,
         },
      };
   }

   async deleteMedicine(medicineId: string) {
      const data = await this.medicineService.deleteMedicine({ _id: medicineId });

      if (!data) throw new NotFoundException('Medicine not found');

      return {
         success: true,
         message: 'medicine deleted',
      };
   }
}
