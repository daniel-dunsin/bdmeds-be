import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { WebhookResponse } from './interfaces';
import { Request, Response } from 'express';
import { WebhookService } from './services/webhooks.service';
import { PaymentProvider } from './providers/payment.provider';
import { IsPublic } from 'src/shared/decorators/auth.decorators';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
   constructor(
      private readonly webhookService: WebhookService,
      private readonly paymentProvider: PaymentProvider,
   ) {}

   @Post('/webhook')
   @IsPublic()
   async webhook(@Req() req: Request<object, object, WebhookResponse>, @Res() res: Response) {
      await this.webhookService.processWebhook(req);

      res.status(200).json({ message: 'webhook processed' });
   }

   @IsPublic()
   @ApiBody({ schema: { type: 'object', properties: { reference: { type: 'string' } } } })
   async verifyTransaction(@Body('reference') reference: string) {
      const data = await this.paymentProvider.verifyTransaction(reference);

      return data;
   }
}
