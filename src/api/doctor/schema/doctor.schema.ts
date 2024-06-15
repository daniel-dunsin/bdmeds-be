import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User, UserDocument } from 'src/api/user/schema/user.schema';
import { schemaOptions } from 'src/shared/constants/db.const';
import { DoctorSpeciality } from '../enums';

@Schema(schemaOptions)
export class Doctor {
   @Prop({
      type: Types.ObjectId,
      ref: User.name,
   })
   user: UserDocument | string;

   @Prop()
   experienceYears: number;

   @Prop({
      type: String,
      enum: Object.values(DoctorSpeciality),
   })
   speciality: DoctorSpeciality;

   @Prop()
   qualifications: string[];

   @Prop({
      type: {
         facebook: {
            type: String,
         },
         twitter: {
            type: String,
         },
         whatsapp: {
            type: String,
         },
         linkedin: {
            type: String,
         },
      },
      required: false,
   })
   socials: {
      facebook: string;
      twitter: string;
      whatsapp: string;
      linkedin: string;
   };
}

export type DoctorDocument = HydratedDocument<Doctor>;
export const DoctorSchema = SchemaFactory.createForClass(Doctor);
