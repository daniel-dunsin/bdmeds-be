import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserProvider } from './user.provider';
import { Auth } from 'src/shared/decorators/auth.decorators';
import { UserDocument } from './schema/user.schema';
import { Base64Pipe } from 'src/core/pipes';

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

   @Put('/profile-picture')
   @ApiBody({
      schema: { type: 'object', properties: { picture: { type: 'string' } } },
   })
   async updateProfilePicture(
      @Auth('_id') userId: string,
      @Body('picture', Base64Pipe) picture: string,
   ) {
      const data = await this.userProvider.updateProfilePicture(
         picture,
         userId,
      );

      return data;
   }
}
