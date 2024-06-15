import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DbMixins, schemaOptions } from 'src/shared/constants/db.const';
import DEFAULT_MATCHERS from 'src/shared/constants/regex.const';
import { Gender, RoleNames } from '../enums';
import DEFAULT_IMAGES from 'src/shared/constants/images.const';

@Schema(schemaOptions)
export class User extends DbMixins {
   @Prop({
      required: true,
      unique: true,
      match: DEFAULT_MATCHERS.email,
   })
   email: string;

   @Prop({
      required: true,
      unique: true,
   })
   phoneNumber: string;

   @Prop({ required: true })
   firstName: string;

   @Prop({ required: true })
   lastName: string;

   @Prop({ select: false })
   password?: string;

   @Prop({ type: Boolean, default: false })
   emailVerified: boolean;

   @Prop({ type: String, enum: Object.values(Gender) })
   gender: Gender;

   @Prop({ type: String, default: DEFAULT_IMAGES.profilePicture })
   profilePicture: string;

   @Prop({ type: String, required: false })
   profilePictureId: string;

   @Prop({ type: String, required: true, enum: Object.values(RoleNames) })
   role: RoleNames;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
