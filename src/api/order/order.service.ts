import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class OrderService {
   constructor(@InjectModel(Order.name) private readonly _orderModel: Model<Order>) {}

   async createOrder<T>(dto: T) {
      return await this._orderModel.create(dto);
   }

   async getOrder(filter: FilterQuery<Order>) {
      return await this._orderModel.findOne(filter);
   }

   async getOrders(filter: FilterQuery<Order>) {
      return await this._orderModel.find(filter);
   }
}
