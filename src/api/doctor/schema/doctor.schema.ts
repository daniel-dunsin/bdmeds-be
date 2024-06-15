import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
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
}
