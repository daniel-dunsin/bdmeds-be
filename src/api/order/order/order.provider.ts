import { Injectable } from '@nestjs/common';
import { OrderService } from './order.service';

@Injectable()
export class OrderProvider {
   constructor(private readonly orderService: OrderService) {}
}
