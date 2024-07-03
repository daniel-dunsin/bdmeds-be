import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Paystack } from 'paystack-sdk';

@Injectable()
export class PaystackService {
   constructor(
      @Inject('paystack') private readonly paystack: Paystack,
      private readonly configService: ConfigService,
   ) {}

   public async initiateTransaction(data: { email: string; reference: string; amount: number }) {
      const frontendUrl = this.configService.get('FRONTEND_URL');
      const response = await this.paystack.transaction.initialize({
         email: data.email,
         reference: data.reference,
         amount: JSON.stringify(parseInt(String(data.amount * 1.1))),
         callback_url: `${frontendUrl}/payment/${data.reference}`,
         currency: 'NGN',
      });

      if (!response?.data || !response?.status) {
         throw new BadRequestException(`❌[paystack]: ${response?.message}`);
      }

      return response.data.authorization_url;
   }
}
