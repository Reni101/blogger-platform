import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { UsersRepository } from '../../../infastructure/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../../domain/user.entity';
import { CryptoService } from '../../crypto.service';
import { UsersService } from '../../users.service';

@Injectable()
export class CreateUserUseCase {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
        private usersService: UsersService,
        private usersRepository: UsersRepository,
        private cryptoService: CryptoService,
    ) {}

    async execute(dto: CreateUserDto) {
        const { login, email } = dto;
        const uniqueUser = await this.usersRepository.findUniqueUser(
            login,
            email,
        );

        this.usersService.validateUniqueUser(uniqueUser, { login, email });

        const passwordHash = await this.cryptoService.createPasswordHash(
            dto.password,
        );

        const user = this.UserModel.createInstance({
            email,
            login,
            passwordHash,
        });

        await this.usersRepository.save(user);
        return user._id.toString();
    }
}
