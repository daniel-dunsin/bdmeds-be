import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckoutDto } from './dtos/checkout.dto';
import { Auth } from 'src/shared/decorators/auth.decorators';
import { UserDocument } from '../user/schema/user.schema';
import { OrderProvider } from './order.provider';

@Controller('order')
@ApiTags('order')
@ApiBearerAuth()
export class OrderController {
   constructor(private readonly orderProvider: OrderProvider) {}

   @Post('checkout')
   async checkout(@Body() checkoutDto: CheckoutDto, @Auth() user: UserDocument) {
      const data = await this.orderProvider.checkout(checkoutDto, user);

      return data;
   }
}
