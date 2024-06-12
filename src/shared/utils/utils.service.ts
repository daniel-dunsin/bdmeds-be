import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class UtilService {
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
}
