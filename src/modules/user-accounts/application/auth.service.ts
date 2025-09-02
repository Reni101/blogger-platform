import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { CryptoService } from './crypto.service';
import { UsersRepository } from '../infastructure/users.repository';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { v4 as uuid } from 'uuid';
import { EmailService } from '../../notifications/email.service';

@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
        private cryptoService: CryptoService,
        private emailService: EmailService,
    ) {}
    async validateUser(
        loginOrEmail: string,
        password: string,
    ): Promise<UserContextDto | null> {
        const user =
            await this.usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) {
            return null;
        }

        const isPasswordValid = await this.cryptoService.comparePassword({
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
                extensions: [
                    { message: 'Email already confirmed', field: 'code' },
                ],
            });
        }
        user.confirmEmail();
        await this.usersRepository.save(user);
    }

    async registrationEmailResending(email: string) {
        const user = await this.usersRepository.findByEmailNotFoundFail(email);

        if (user.emailConfirmation.isConfirmed) {
            throw new DomainException({
                code: DomainExceptionCode.BadRequest,
                message: 'Email already confirmed',
                extensions: [
                    { message: 'Email already confirmed', field: 'email' },
                ],
            });
        }
        const code = uuid();
        user.resendingEmail(code);
        await this.usersRepository.save(user);
        debugger;
        this.emailService
            .resendEmail(user.email, user.emailConfirmation.confirmationCode)
            .catch(console.error);
    }
}
