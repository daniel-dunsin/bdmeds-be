import { Module } from '@nestjs/common';
import { MedicineController } from './medicine.controller';
import { MedicineProvider } from './medicine.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicineService } from './medicine.service';
import { Medicine, MedicineSchema } from './schemas/medicine.schema';

@Module({
   imports: [
      MongooseModule.forFeatureAsync([
         {
            name: Medicine.name,
            useFactory() {
               const schema = MedicineSchema;

               return schema;
            },
         },
      ]),
   ],
   controllers: [MedicineController],
   providers: [MedicineProvider, MedicineService],
})
export class MedicineModule {}
