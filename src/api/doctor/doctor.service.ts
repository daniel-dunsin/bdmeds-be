import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor, DoctorDocument } from './schema/doctor.schema';
import { FilterQuery, Model, PipelineStage, Query, QueryOptions, UpdateQuery } from 'mongoose';
import { KycDocsDto } from './dto/kyc-verification.dto';
import { KycVerification, KycVerificationDocument } from './schema/kyc-verification.schema';

@Injectable()
export class DoctorService {
   constructor(
      @InjectModel(Doctor.name)
      private readonly _doctorModel: Model<DoctorDocument>,
      @InjectModel(KycVerification.name)
      private readonly _kycModel: Model<KycVerificationDocument>,
   ) {}

   private async populate(model: Query<any, DoctorDocument>) {
      return await model.populate([{ path: 'user' }, { path: 'kycDetails' }]);
   }

   async createDoctor<T>(data: T) {
      const doctor = await this._doctorModel.create(data);

      return doctor;
   }

   async getDoctor(filter: FilterQuery<DoctorDocument>) {
      const doctor = await this.populate(this._doctorModel.findOne(filter));

      return doctor;
   }

   async getDoctors(filter: FilterQuery<DoctorDocument>) {
      const { search = '', ...match } = filter;
      const pipelines: PipelineStage[] = [
         {
            $match: filter,
         },
         {
            $lookup: {
               from: 'users',
               foreignField: '_id',
               localField: 'user',
               as: 'user',
            },
         },
         {
            $unwind: {
               path: '$user',
               preserveNullAndEmptyArrays: false,
            },
         },
         {
            $sort: { createdAt: -1 },
         },
      ];

      if (search) {
         pipelines.push({
            $match: {
               $or: [
                  {
                     'user.firstName': { $regex: search, $options: 'i' },
                  },
                  {
                     'user.lastName': { $regex: search, $options: 'i' },
                  },
               ],
            },
         });
      }

      const doctors = await this._doctorModel.aggregate(pipelines);
      return doctors;
   }

   async updateDoctor(
      filter: FilterQuery<DoctorDocument>,
      update: UpdateQuery<DoctorDocument>,
      options?: QueryOptions<DoctorDocument>,
   ) {
      const doctor = await this.populate(
         this._doctorModel.findOneAndUpdate(filter, update, {
            new: true,
            runValidators: true,
            ...options,
         }),
      );

      return doctor;
   }

   async deleteDoctor(filter: FilterQuery<DoctorDocument>) {
      const doctor = await this._doctorModel.findOneAndDelete(filter);

      return doctor;
   }

   async updateKyc(kycVerificationDto: KycDocsDto, doctorId: string) {
      const kyc = await this._kycModel.findOneAndUpdate({ doctor: doctorId }, kycVerificationDto, {
         upsert: true,
         new: true,
         runValidators: true,
      });

      return kyc;
   }

   async getDoctorKyc(doctorId: string) {
      const kyc = await this._kycModel.findOne({ doctor: doctorId });

      return kyc;
   }

   async getKycs(filter: FilterQuery<KycVerificationDocument>) {
      const kycs = await this._kycModel.find(filter).populate({
         path: 'doctor',
         select: 'user',
         populate: { path: 'user', select: 'firstName lastName profilePicture' },
      });

      return kycs;
   }
}
