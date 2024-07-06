import { Module, forwardRef } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentProvider } from './providers/payment.provider';
import { PaymentService } from './services/payment.service';
import { WebhookService } from './services/webhooks.service';
import { PaystackService } from './services/paystack.service';
import { PaystackProvider } from './providers/paystack.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentAttempt, PaymentAttemptSchema } from './schemas/payment.attempt.schema';
import { SharedModule } from 'src/shared/shared.module';
import { OrderModule } from '../order/order.module';
import { UserModule } from '../user/user.module';
import { AppointmentModule } from '../appointment/appointment.module';

@Module({
   imports: [
      MongooseModule.forFeature([
         {
            name: PaymentAttempt.name,
            schema: PaymentAttemptSchema,
         },
      ]),
      SharedModule,
      forwardRef(() => OrderModule),
      forwardRef(() => AppointmentModule),
      UserModule,
   ],
   controllers: [PaymentController],
   providers: [PaymentProvider, PaymentService, WebhookService, PaystackService, PaystackProvider],
   exports: [PaymentService, PaystackService],
})
export class PaymentModule {}
