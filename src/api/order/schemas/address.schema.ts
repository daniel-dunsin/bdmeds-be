import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class Address {
   @Prop()
   state: string;

   @Prop()
   city: string;

   @Prop()
   country: string;

   @Prop()
   streetAddress: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
