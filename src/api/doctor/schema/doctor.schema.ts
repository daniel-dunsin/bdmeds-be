import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User, UserDocument } from 'src/api/user/schema/user.schema';
import { schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class Doctor {
   @Prop({
      type: Types.ObjectId,
      ref: User.name,
   })
   user: UserDocument | string;
}
