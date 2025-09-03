import { CreateUserDto } from '../../../dto/create-user.dto';
import { UsersRepository } from '../../../infastructure/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../../domain/user.entity';
import { CryptoService } from '../../crypto.service';
import { UsersService } from '../../users.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateUserCommand {
    constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
        private usersService: UsersService,
        private usersRepository: UsersRepository,
        private cryptoService: CryptoService,
    ) {}

    async execute({ dto }: CreateUserCommand) {
        const { login, email } = dto;

        await this.usersService.validateUniqueUser({ login, email });

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
