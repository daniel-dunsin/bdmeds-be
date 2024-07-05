import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Consultation, ConsultationDocument } from '../schemas/consultation.schema';
import { ClientSession, FilterQuery, Model, Query, QueryOptions, UpdateQuery } from 'mongoose';

@Injectable()
export class ConsultationService {
   constructor(
      @InjectModel(Consultation.name) private readonly _consultationModel: Model<ConsultationDocument>,
   ) {}

   private async populate(model: Query<any, ConsultationDocument>) {
      return await model.populate([{ path: 'diagnosis' }, { path: 'appointment' }]);
   }

   async createConsultation<T>(createConsultaionDto: T, session?: ClientSession) {
      const consultation = new this._consultationModel(createConsultaionDto);

      return await consultation.save({ session });
   }

   async getConsultation(filter: FilterQuery<ConsultationDocument>): Promise<ConsultationDocument> {
      const consulation = await this.populate(this._consultationModel.findOne(filter));

      return consulation;
   }

   async getConsultations(filter: FilterQuery<ConsultationDocument>): Promise<ConsultationDocument[]> {
      const consulation = await this.populate(this._consultationModel.find(filter).sort({ createdAt: -1 }));

      return consulation;
   }

   async updateConsultation(
      filter: FilterQuery<ConsultationDocument>,
      update: UpdateQuery<ConsultationDocument>,
      options: QueryOptions<ConsultationDocument>,
   ): Promise<ConsultationDocument> {
      const consulation = await this.populate(
         this._consultationModel.findOneAndUpdate(filter, update, options),
      );

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
