import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Medicine, MedicineDocument } from './schemas/medicine.schema';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { PaginationQuery } from 'src/shared/interfaces/pagination.interface';
import { UtilService } from 'src/shared/services/utils.service';

@Injectable()
export class MedicineService {
   constructor(
      @InjectModel(Medicine.name) private readonly _medicineModel: Model<Medicine>,
      private readonly utilService: UtilService,
   ) {}

   async createMedicine<T>(data: T) {
      const medicine = await this._medicineModel.create(data);

      return data;
   }

   async getMedicine(filter: FilterQuery<MedicineDocument>) {
      return await this._medicineModel.findOne(filter);
   }

   async getMedicines(filter: FilterQuery<MedicineDocument>, paginationQuery: PaginationQuery) {
      const count = await this._medicineModel.find(filter).countDocuments();

      const { skip, page, totalPages, limit } = this.utilService.resolvePaginationQuery({
         ...paginationQuery,
         count,
      });

      const data = await this._medicineModel.find(filter).limit(limit).skip(skip);

      return {
         data,
         page,
         totalPages,
         count,
      };
   }

   async updateMedicine(filter: FilterQuery<MedicineDocument>, update: UpdateQuery<MedicineDocument>) {
      const data = await this._medicineModel.findOneAndUpdate(filter, update);

      return data;
   }

   async deleteMedicine(filter: FilterQuery<MedicineDocument>) {
      const data = await this._medicineModel.findOneAndDelete(filter);

      return data;
   }
}
