import { Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebhookResponse } from './interfaces';
import { Request, Response } from 'express';
import { WebhookService } from './services/webhooks.service';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
   constructor(private readonly webhookService: WebhookService) {}

   @Post('/webhook')
   async webhook(@Req() req: Request<object, object, WebhookResponse>, @Res() res: Response) {
      await this.webhookService.processWebhook(req);

      res.status(200).json({ message: 'webhook processed' });
   }
}
