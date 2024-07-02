import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderProvider } from './order.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';

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
   ],
   controllers: [OrderController],
   providers: [OrderService, OrderProvider],
   exports: [OrderService, OrderProvider],
})
export class OrderModule {}
