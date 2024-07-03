import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderProvider } from './order.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { PaymentModule } from '../payment/payment.module';
import { MedicineModule } from '../medicine/medicine.module';

@Module({
   imports: [
      MongooseModule.forFeatureAsync([
         {
            name: Order.name,
            useFactory: () => {
               const schema = OrderSchema;

               return schema;
            },
         },
      ]),
      PaymentModule,
      MedicineModule,
   ],
   controllers: [OrderController],
   providers: [OrderService, OrderProvider],
   exports: [OrderService, OrderProvider],
})
export class OrderModule {}
