import { UsersRepository } from '../../../infastructure/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteUserCommand {
    constructor(public id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ id }: DeleteUserCommand) {
        const user = await this.usersRepository.findOrNotFoundFail(id);
        user.makeDeleted();
        await this.usersRepository.save(user);
    }
}
