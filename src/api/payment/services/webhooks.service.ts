import { ForbiddenException, Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { ChargeResponse, WebhookResponse } from '../interfaces';
import { Request } from 'express';
import { PaymentStatus, WebhookEvents } from '../enums';
import { PaymentService } from './payment.service';
import { MailService } from 'src/shared/mail/mail.service';
import { OrderService } from 'src/api/order/order.service';
import { UserService } from 'src/api/user/user.service';

@Injectable()
export class WebhookService {
   constructor(
      private readonly configService: ConfigService,
      private readonly paymentService: PaymentService,
      private readonly mailService: MailService,
      private readonly orderService: OrderService,
      private readonly userService: UserService,
   ) {}

   private validateWebhook(signature: string, webhookResponse: WebhookResponse) {
      const secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
      const hash = crypto
         .createHmac('sha512', secretKey)
         .update(JSON.stringify(webhookResponse))
         .digest('hex');
      if (hash != signature)
         throw new ForbiddenException('oops! this endpoint is only authorized for paystack');
   }

   async processWebhook(req: Request<object, object, WebhookResponse>) {
      const signature = <string>req.headers['x-paystack-signature'];

      this.validateWebhook(signature, req.body);

      const event = req.body.event;
      const reference = req.body.data.reference;

      switch (event) {
         case WebhookEvents.TRANSACTION_SUCCESSFUL:
            if (reference.startsWith('medicine-checkout')) {
               await this.successfulMedicinePurchase(req.body.data);
            }
            break;

         case WebhookEvents.TRANSACTION_FAILED:
            if (reference.startsWith('medicine-checkout')) {
               await this.failedMedicinePurchase(req.body.data);
            }
            break;

         default:
            throw new MethodNotAllowedException('Method not implemented!');
      }
   }

   async successfulMedicinePurchase(chargeResponse: ChargeResponse) {
      const attempt = await this.paymentService.updatePaymentAttempt(
         { reference: chargeResponse.reference },
         { status: PaymentStatus.SUCCESSFUL },
      );

      if (!attempt) throw new NotFoundException('transaction not found');

      const order = await this.orderService.createOrder({
         ...attempt.metadata,
         user: attempt.user,
      });

      const user = await this.userService.getUser({ _id: attempt.user });

      await this.mailService.sendMail({
         to: user?.email,
         subject: 'Order Processed! 📦',
         template: 'drugs-purchased',
         context: {
            firstName: user?.firstName,
         },
      });
   }

   async failedMedicinePurchase(chargeResponse: ChargeResponse) {
      const attempt = await this.paymentService.updatePaymentAttempt(
         {
            reference: chargeResponse.reference,
         },
         { status: PaymentStatus.FAILED },
      );

      if (!attempt) throw new NotFoundException('transaction not found');
   }
}
