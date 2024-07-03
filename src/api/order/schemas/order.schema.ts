import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User, UserDocument } from 'src/api/user/schema/user.schema';
import { schemaOptions } from 'src/shared/constants/db.const';
import { Cart, CartSchema } from './cart.schema';
import { Address, AddressSchema } from './address.schema';

@Schema(schemaOptions)
export class Order {
   @Prop({
      type: Types.ObjectId,
      ref: User.name,
   })
   user: UserDocument | string;

   @Prop({
      type: [CartSchema],
   })
   cart: Cart[];

   @Prop({
      type: AddressSchema,
   })
   address: Address;

   @Prop({})
   orderNotes: string;

   @Prop()
   totalAmount: number;

   @Prop()
   deliveryFee: number;
}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);
