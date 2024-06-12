import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserProvider } from './user.provider';
import { Auth } from 'src/shared/decorators/auth.decorators';
import { UserDocument } from './schema/user.schema';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
   constructor(private readonly userProvider: UserProvider) {}

   @Get()
   async getUser(@Auth() user: UserDocument) {
      const data = await this.userProvider.getUser(user);

      return data;
   }
}
