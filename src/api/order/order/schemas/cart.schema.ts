import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Medicine, MedicineDocument } from 'src/api/medicine/schemas/medicine.schema';

@Schema()
export class Cart {
   @Prop({
      type: Types.ObjectId,
      ref: Medicine.name,
   })
   medicine: MedicineDocument;

   @Prop({
      type: Number,
      min: 1,
   })
   qty: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
