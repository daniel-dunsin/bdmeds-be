import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Address {
   @Prop({ required: false })
   state: string;

   @Prop({ required: false })
   city: string;

   @Prop({ required: false })
   country: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);