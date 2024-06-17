import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Consultation, ConsultationDocument } from '../schemas/consultation.schema';
import { ClientSession, FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

@Injectable()
export class ConsultationService {
   constructor(
      @InjectModel(Consultation.name) private readonly _consultationModel: Model<ConsultationDocument>,
   ) {}

   async createConsultation<T>(createConsultaionDto: T, session?: ClientSession) {
      const consultation = new this._consultationModel(createConsultaionDto);

      return await consultation.save({ session });
   }

   async getConsultation(filter: FilterQuery<ConsultationDocument>): Promise<ConsultationDocument> {
      const consulation = await this._consultationModel.findOne(filter);

      return consulation;
   }

   async getConsultations(filter: FilterQuery<ConsultationDocument>): Promise<ConsultationDocument[]> {
      const consulation = await this._consultationModel.find(filter);

      return consulation;
   }

   async updateConsultation(
      filter: FilterQuery<ConsultationDocument>,
      update: UpdateQuery<ConsultationDocument>,
      options: QueryOptions<ConsultationDocument>,
   ): Promise<ConsultationDocument> {
      const consulation = await this._consultationModel.findOneAndUpdate(filter, update, options);

      return consulation;
   }

   async deleteConsultation(
      filter: FilterQuery<ConsultationDocument>,
      options: QueryOptions<ConsultationDocument>,
   ) {
      const consulation = await this._consultationModel.findOneAndDelete(filter, options);

      return consulation;
   }
}
