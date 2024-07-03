import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Paystack } from 'paystack-sdk';

export const PaystackProvider: Provider = {
   provide: 'paystack',
   inject: [ConfigService],
   useFactory(configService: ConfigService) {
      const secretKey = configService.get<string>('PAYSTACK_SECRET_KEY');

      return new Paystack(secretKey);
   },
};
