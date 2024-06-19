import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorProvider } from './doctor.provider';
import { DoctorController } from './doctor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor, DoctorSchema } from './schema/doctor.schema';
import { UserModule } from '../user/user.module';
import { KycVerification, KycVerificationSchema } from './schema/kyc-verification.schema';
import { SharedModule } from 'src/shared/shared.module';
import { SPECIALITY_TO_DEPARTMENT } from './enums';

@Module({
   imports: [
      MongooseModule.forFeatureAsync([
         {
            name: Doctor.name,
            useFactory() {
               const schema = DoctorSchema;

               schema.pre('save', function () {
                  if (this.isModified('speciality')) {
                     this.department = SPECIALITY_TO_DEPARTMENT[this.speciality];
                  }

                  return;
               });

               schema.virtual('kycDetails', {
                  justOne: true,
                  foreignField: 'doctor',
                  localField: '_id',
                  ref: KycVerification.name,
               });

               return schema;
            },
         },
         {
            name: KycVerification.name,
            useFactory() {
               const schema = KycVerificationSchema;

               return schema;
            },
         },
      ]),
      UserModule,
      SharedModule,
   ],
   providers: [DoctorService, DoctorProvider],
   controllers: [DoctorController],
   exports: [DoctorService],
})
export class DoctorModule {}
