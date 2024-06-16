import { Prop, SchemaFactory } from '@nestjs/mongoose';

export class TempPatient {
   @Prop()
   firstName: string;

   @Prop()
   lastName: string;

   @Prop()
   email: string;

   @Prop()
   phoneNumber: string;
}

export const TempPatientSchema = SchemaFactory.createForClass(TempPatient);
