import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserProvider } from './user.provider';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
   constructor(private readonly userProvider: UserProvider) {}
}
