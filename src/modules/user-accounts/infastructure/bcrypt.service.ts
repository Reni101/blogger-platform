import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService {
    async generateHash(password: string) {
        return bcrypt.hash(password, 10);
    }
}
