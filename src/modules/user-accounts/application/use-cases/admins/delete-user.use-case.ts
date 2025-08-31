import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../infastructure/users.repository';

@Injectable()
export class DeleteUserUseCase {
    constructor(private usersRepository: UsersRepository) {}
    async execute(id: string) {
        const user = await this.usersRepository.findOrNotFoundFail(id);
        user.makeDeleted();
        await this.usersRepository.save(user);
    }
}
