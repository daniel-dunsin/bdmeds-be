import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor, DoctorDocument } from './schema/doctor.schema';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

@Injectable()
export class DoctorService {
   constructor(
      @InjectModel(Doctor.name)
      private readonly _doctorModel: Model<DoctorDocument>,
   ) {}

   async createDoctor<T>(data: T) {
      const doctor = await this._doctorModel.create(data);

      return doctor;
   }

   async getDoctor(filter: FilterQuery<DoctorDocument>) {
      const doctor = await this._doctorModel.findOne(filter).populate('user');

      return doctor;
   }

   async getDoctors(filter: FilterQuery<DoctorDocument>) {
      const doctors = await this._doctorModel.find(filter).populate('user');

      return doctors;
   }

   async updateDoctor(
      filter: FilterQuery<DoctorDocument>,
      update: UpdateQuery<DoctorDocument>,
      options?: QueryOptions<DoctorDocument>,
   ) {
      const doctor = await this._doctorModel
         .findOneAndUpdate(filter, update, { new: true, ...options })
         .populate('user');

      return doctor;
   }

   async deleteDoctor(filter: FilterQuery<DoctorDocument>) {
      const doctor = await this._doctorModel.findOneAndDelete(filter);

      return doctor;
   }
}
