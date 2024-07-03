import { Inject, Injectable } from '@nestjs/common';
import { PaymentAttempt } from '../schemas/payment.attempt.schema';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PaymentService {
   constructor(
      @InjectModel(PaymentAttempt.name) private readonly _paymentAttemptModel: Model<PaymentAttempt>,
   ) {}

   async createPaymentAttempt<T>(createPaymentAttemptDto: T) {
      const data = await this._paymentAttemptModel.create(createPaymentAttemptDto);

      return data;
   }

   async getPaymentAttempt(filter: FilterQuery<PaymentAttempt>) {
      return await this._paymentAttemptModel.findOne(filter);
   }

   async updatePaymentAttempt(filter: FilterQuery<PaymentAttempt>, update: UpdateQuery<PaymentAttempt>) {
      return await this._paymentAttemptModel.findOneAndUpdate(filter, update);
   }

   async getPaymentAttempts(filter: FilterQuery<PaymentAttempt>) {
      return await this._paymentAttemptModel.find(filter);
   }
}
