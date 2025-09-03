import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infastructure/users.repository';
import { v4 as uuid } from 'uuid';
import { EmailService } from '../../../../notifications/email.service';

export class PasswordRecoveryCommand {
    constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
    implements ICommandHandler<PasswordRecoveryCommand>
{
    constructor(
        private readonly usersRepository: UsersRepository,
        private emailService: EmailService,
    ) {}
    async execute({ email }: PasswordRecoveryCommand) {
        const user = await this.usersRepository.findByEmailNotFoundFail(email);

        const code = uuid();
        user.updateRecoveryCode(code);
        await this.usersRepository.save(user);
        this.emailService
            .passwordRecoveryEmail(
                user.email,
                user.emailConfirmation.confirmationCode,
            )
            .catch(console.error);
    }
}
