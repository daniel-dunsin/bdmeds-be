import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Doctor, DoctorDocument } from 'src/api/doctor/schema/doctor.schema';
import { User, UserDocument } from 'src/api/user/schema/user.schema';
import { schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class Patient {
   @Prop({
      type: Types.ObjectId,
      ref: User.name,
   })
   user: UserDocument | string;

   @Prop()
   dateOfBirth: Date;

   @Prop({
      type: [
         {
            type: Types.ObjectId,
            ref: Doctor.name,
         },
      ],
      default: [],
   })
   favouriteDoctors: Array<DoctorDocument | string>;
}

export type PatientDocument = HydratedDocument<Patient>;
export const PatientSchema = SchemaFactory.createForClass(Patient);
