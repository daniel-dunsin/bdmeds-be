import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User, UserDocument } from 'src/api/user/schema/user.schema';
import { schemaOptions } from 'src/shared/constants/db.const';
import { Days, Departments, DoctorSpeciality } from '../enums';
import { availableDays } from '../interfaces';

@Schema(schemaOptions)
export class Doctor {
   @Prop({
      type: Types.ObjectId,
      ref: User.name,
   })
   user: UserDocument;

   @Prop()
   yearsOfExperience: number;

   @Prop({
      type: String,
      enum: Object.values(DoctorSpeciality),
   })
   speciality: DoctorSpeciality;

   @Prop({
      type: String,
      enum: Object.values(Departments),
   })
   department: Departments;

   @Prop()
   qualifications: string[];

   @Prop()
   bio: string;

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

   @Prop({ default: false })
   kycVerified: boolean;

   @Prop({ default: true })
   isAvailable: boolean;

   @Prop({
      type: [
         {
            day: {
               type: String,
               enum: Object.values(Days),
            },
            startTime: {
               type: Date,
            },
            endTime: {
               type: Date,
            },
         },
      ],
      default: [],
   })
   availableDays: availableDays[];
}

export type DoctorDocument = HydratedDocument<Doctor>;
export const DoctorSchema = SchemaFactory.createForClass(Doctor);
