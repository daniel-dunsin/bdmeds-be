import { Injectable } from '@nestjs/common';
import { OrderService } from './order.service';
import { PaymentService } from '../payment/services/payment.service';
import { CheckoutDto } from './dtos/checkout.dto';
import { v4 } from 'uuid';
import { UserDocument } from '../user/schema/user.schema';
import { MedicineService } from '../medicine/medicine.service';
import { Order } from './schemas/order.schema';
import { PaystackService } from '../payment/services/paystack.service';

@Injectable()
export class OrderProvider {
   private deliveryFee = 3000;

   constructor(
      private readonly orderService: OrderService,
      private readonly paymentService: PaymentService,
      private readonly medicineService: MedicineService,
      private readonly paystackService: PaystackService,
   ) {}

   async checkout(checkoutDto: CheckoutDto, user: UserDocument) {
      const reference = `checkout-${v4()}`;

      const { data: medicines } = await this.medicineService.getMedicines({
         _id: { $in: checkoutDto.cart.map((cart) => cart.medicine) },
      });

      const total = checkoutDto.cart.reduce((acc, curr) => {
         const medicine = medicines.find((med) => String(med._id) === String(curr.medicine));

         acc += medicine.price * curr.qty;
         return acc;
      }, 0);

      const order: Omit<Order, 'user'> = {
         cart: checkoutDto.cart,
         address: checkoutDto.address,
         totalAmount: total,
         deliveryFee: this.deliveryFee,
         orderNotes: checkoutDto.orderNotes,
      };

      const paymentLink = await this.paystackService.initiateTransaction({
         email: user.email,
         reference,
         amount: total + this.deliveryFee,
      });

      await this.paymentService.createPaymentAttempt({
         reference,
         amount: total + this.deliveryFee,
         user: user._id,
         metadata: order,
      });

      return paymentLink;
   }
}
