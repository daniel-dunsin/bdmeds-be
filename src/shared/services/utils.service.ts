import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UserDocument } from 'src/api/user/schema/user.schema';

@Injectable()
export class UtilService {
   constructor(private readonly configService: ConfigService) {}

   async hashPassword(password: string) {
      const saltFactor = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, saltFactor);

      return hashedPassword;
   }

   async comparePassword(password: string, hash: string) {
      return await bcrypt.compare(password, hash);
   }

   generateToken() {
      return crypto.randomBytes(32).toString('hex');
   }

   excludePassword(user: UserDocument) {
      delete user['_doc'].password;

      return user['_doc'];
   }
}
