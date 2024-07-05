import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { ApiBody } from '@nestjs/swagger';

@Injectable()
export class PaymentProvider {
   constructor(private readonly paymentService: PaymentService) {}

   async verifyTransaction(reference: string) {
      const transaction = await this.paymentService.getPaymentAttempt({ reference });

      if (!transaction) throw new NotFoundException('transaction not found');

      return {
         message: 'trasnaction fetched',
         success: true,
         data: transaction,
      };
   }
}
