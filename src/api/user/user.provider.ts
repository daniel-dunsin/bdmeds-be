import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDocument } from './schema/user.schema';
import { UtilService } from 'src/shared/services/utils.service';

@Injectable()
export class UserProvider {
   constructor(
      private readonly userService: UserService,
      private readonly utilService: UtilService,
   ) {}

   async getUser(user: UserDocument) {
      const data = await this.userService.getUser({ _id: user._id });

      if (!data) throw new NotFoundException('Profile not found');

      return {
         success: true,
         message: 'user info fetched',
         data: this.utilService.excludePassword(data),
      };
   }
}
