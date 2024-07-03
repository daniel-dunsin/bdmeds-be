import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User, UserDocument } from 'src/api/user/schema/user.schema';
import { schemaOptions } from 'src/shared/constants/db.const';
import { PaymentStatus } from '../enums';

@Schema(schemaOptions)
export class PaymentAttempt {
   @Prop({
      type: Types.ObjectId,
      ref: User.name,
   })
   user: UserDocument | string;

   @Prop()
   reference: string;

   @Prop({
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
   })
   status: PaymentStatus;

   @Prop()
   amount: number;

   @Prop({
      type: Object,
   })
   metadata: object;
}

export type PaymentAttemptDocument = HydratedDocument<PaymentAttempt>;
export const PaymentAttemptSchema = SchemaFactory.createForClass(PaymentAttempt);
