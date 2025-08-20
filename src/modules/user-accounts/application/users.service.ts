import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../domain/user.entity';
import { UsersRepository } from '../infastructure/users.repository';
import { CryptoService } from './crypto.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
        private cryptoService: CryptoService,
        private usersRepository: UsersRepository,
    ) {}
    async createUser(dto: CreateUserDto) {
        const passwordHash = await this.cryptoService.createPasswordHash(
            dto.password,
        );

        const user = this.UserModel.createInstance({
            email: dto.email,
            login: dto.login,
            passwordHash: passwordHash,
        });

        await this.usersRepository.save(user);
        return user._id.toString();
    }

    async deleteUser(id: string) {
        const user = await this.usersRepository.findOrNotFoundFail(id);
        user.makeDeleted();
        await this.usersRepository.save(user);
    }
}
