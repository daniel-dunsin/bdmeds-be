import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { schemaOptions } from 'src/shared/constants/db.const';
import { Doctor, DoctorDocument } from './doctor.schema';
import { KycIdType, KycStatus } from '../enums';

@Schema(schemaOptions)
export class KycVerification {
   @Prop({ type: Types.ObjectId, ref: Doctor.name, required: true })
   doctor: DoctorDocument | string;

   @Prop()
   idDoc: string;

   @Prop({ type: String, enum: Object.values(KycIdType) })
   idType: KycIdType;

   @Prop()
   professionalCert: string;

   @Prop()
   idDocPublicId: string;

   @Prop()
   professionalCertPublicId: string;

   @Prop({
      type: String,
      enum: Object.values(KycStatus),
      default: KycStatus.PENDING,
   })
   status: KycStatus;
}

export type KycVerificationDocument = HydratedDocument<KycVerification>;
export const KycVerificationSchema =
   SchemaFactory.createForClass(KycVerification);
