import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DbMixins, schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class Medicine extends DbMixins {
   @Prop()
   name: string;

   @Prop()
   description: string;

   @Prop()
   image: string;

   @Prop()
   stock: number;

   @Prop()
   price: number;
}

export type MedicineDocument = HydratedDocument<Medicine>;
export const MedicineSchema = SchemaFactory.createForClass(Medicine);
