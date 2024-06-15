import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorProvider } from './doctor.provider';
import { DoctorController } from './doctor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor, DoctorSchema } from './schema/doctor.schema';
import { UserModule } from '../user/user.module';

@Module({
   imports: [
      MongooseModule.forFeatureAsync([
         {
            name: Doctor.name,
            useFactory() {
               const schema = DoctorSchema;

               return schema;
            },
         },
      ]),
      UserModule,
   ],
   providers: [DoctorService, DoctorProvider],
   controllers: [DoctorController],
   exports: [DoctorService],
})
export class DoctorModule {}
