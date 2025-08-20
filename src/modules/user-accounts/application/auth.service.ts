import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { CryptoService } from './crypto.service';
import { UsersRepository } from '../infastructure/users.repository';
import {
    DomainException,
    Extension,
} from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
        private cryptoService: CryptoService,
    ) {}
    async validateUser(
        login: string,
        password: string,
    ): Promise<UserContextDto | null> {
        const user = await this.usersRepository.findByLogin(login);
        if (!user) {
            return null;
        }

        const isPasswordValid = await this.cryptoService.comparePasswords({
            password,
            hash: user.passwordHash,
        });

        if (!isPasswordValid) {
            return null;
        }

        return { id: user.id.toString() };
    }

    async login(userId: string) {
        const accessToken = this.jwtService.sign({ id: userId });
        const refreshToken = this.jwtService.sign(
            { id: userId },
            { expiresIn: '20m' },
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    async validateUniqueUser(login: string, email: string) {
        const user = await this.usersRepository.findUniqueUser(login, email);
        if (!user) return;
        const extensions: Extension[] = [];
        if (user.login === login) {
            extensions.push({
                field: 'login',
                message: 'login already exists',
            });
        }
        if (user.email === email) {
            extensions.push({
                field: 'email',
                message: 'email already exists',
            });
        }
        throw new DomainException({
            code: DomainExceptionCode.BadRequest,
            message: 'registration error',
            extensions,
        });
    }
}
