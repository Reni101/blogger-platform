import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { UsersRepository } from '../../../infastructure/users.repository';

export class RegistrationConfirmationCommand {
    constructor(public code: string) {}
}
@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase
    implements ICommandHandler<RegistrationConfirmationCommand>
{
    constructor(private usersRepository: UsersRepository) {}

    async execute({ code }: RegistrationConfirmationCommand) {
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
}
