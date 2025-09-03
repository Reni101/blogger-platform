import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { v4 as uuid } from 'uuid';
import { UsersRepository } from '../../../infastructure/users.repository';
import { EmailService } from '../../../../notifications/email.service';

export class RegistrationEmailResendingCommand {
    constructor(public email: string) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase
    implements ICommandHandler<RegistrationEmailResendingCommand>
{
    constructor(
        private usersRepository: UsersRepository,
        private emailService: EmailService,
    ) {}
    async execute({ email }: RegistrationEmailResendingCommand) {
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
        this.emailService
            .resendEmail(user.email, user.emailConfirmation.confirmationCode)
            .catch(console.error);
    }
}
