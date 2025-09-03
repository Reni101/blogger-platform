import { User, UserModelType } from '../../../domain/user.entity';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { UsersRepository } from '../../../infastructure/users.repository';
import { EmailService } from '../../../../notifications/email.service';
import { CryptoService } from '../../crypto.service';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../../users.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class RegisterUserCommand {
    constructor(public dto: CreateUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
    implements ICommandHandler<RegisterUserCommand>
{
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
        private usersService: UsersService,
        private usersRepository: UsersRepository,
        private cryptoService: CryptoService,
        private emailService: EmailService,
    ) {}

    async execute({ dto }: RegisterUserCommand) {
        const { login, email, password } = dto;

        await this.usersService.validateUniqueUser({ login, email });

        const passwordHash =
            await this.cryptoService.createPasswordHash(password);

        const user = this.UserModel.createInstance({
            email,
            login,
            passwordHash,
        });

        this.emailService
            .sendConfirmationEmail(
                user.email,
                user.emailConfirmation.confirmationCode,
            )
            .catch(console.error);
    }
}
