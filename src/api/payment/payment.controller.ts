import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {}
