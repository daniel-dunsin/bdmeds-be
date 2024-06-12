import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserProvider } from './user.provider';

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private readonly userProvider: UserProvider) {}
}
