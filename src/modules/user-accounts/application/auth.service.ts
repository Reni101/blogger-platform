import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { CryptoService } from './crypto.service';
import { UsersRepository } from '../infastructure/users.repository';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
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

    async registrationConfirmation(code: string) {
        const user = await this.usersRepository.findByCodeOrNotFoundFail(code);
        if (user.emailConfirmation.isConfirmed) {
            throw new DomainException({
                code: DomainExceptionCode.BadRequest,
                message: 'Email already confirmed',
            });
        }
        user.confirmEmail();
        await this.usersRepository.save(user);
    }
}
