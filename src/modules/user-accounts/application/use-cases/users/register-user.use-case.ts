import { User, UserDocument, UserModelType } from '../../../domain/user.entity';
import {
    DomainException,
    Extension,
} from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { UsersRepository } from '../../../infastructure/users.repository';
import { EmailService } from '../../../../notifications/email.service';
import { CryptoService } from '../../crypto.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RegisterUserUseCase {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
        private usersRepository: UsersRepository,
        private cryptoService: CryptoService,
        private emailService: EmailService,
    ) {}

    async execute(dto: CreateUserDto) {
        const { login, email } = dto;
        const uniqueUser = await this.usersRepository.findUniqueUser(
            login,
            email,
        );
        this.validateUniqueUser(uniqueUser, { login, email });

        const passwordHash = await this.cryptoService.createPasswordHash(
            dto.password,
        );

        const user = this.UserModel.createInstance({
            email,
            login,
            passwordHash,
        });

        await this.usersRepository.save(user);

        this.emailService
            .sendConfirmationEmail(
                user.email,
                user.emailConfirmation.confirmationCode,
            )
            .catch(console.error);
    }

    private validateUniqueUser(
        uniqueUser: UserDocument | null,
        dto: { login: string; email: string },
    ) {
        if (uniqueUser) {
            const extensions: Extension[] = [];
            if (uniqueUser.login === dto.login) {
                extensions.push({
                    field: 'login',
                    message: 'login already exists',
                });
            }
            if (uniqueUser.email === dto.email) {
                extensions.push({
                    field: 'email',
                    message: 'email already exists',
                });
            }

            throw new DomainException({
                code: DomainExceptionCode.BadRequest,
                message: 'error creating users',
                extensions,
            });
        }
    }
}
