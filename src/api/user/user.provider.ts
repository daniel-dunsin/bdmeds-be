import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class UserProvider {
    constructor(private readonly userService: UserService) {}
}
