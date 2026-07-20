import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersPostgresRepository } from '../../../../infastructure/postgres/users.postgres.repository';
import { CreateUserDto } from '../../../../dto/create-user.dto';
import { CryptoService } from '../../../crypto.service';
import { UsersPostgresService } from '../../../users-postgres.service';
import { IUserPostgres } from '../../../../domain/postgres/IUserPostgres';
import { v4 as uuid } from 'uuid';
import { add } from 'date-fns';

export class CreateUserPostgresCommand {
    constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserPostgresCommand)
export class CreateUserPostgresUseCase
    implements ICommandHandler<CreateUserPostgresCommand>
{
    constructor(
        private usersPostgresService: UsersPostgresService,
        private usersPostgresRepository: UsersPostgresRepository,
        private cryptoService: CryptoService,
    ) {}

    async execute({ dto }: CreateUserPostgresCommand) {
        const { login, email } = dto;

        await this.usersPostgresService.validateUniqueUser({ login, email });

        const passwordHash = await this.cryptoService.createPasswordHash(
            dto.password,
        );
        const userModel: Omit<IUserPostgres, 'id'> = {
            createdAt: new Date(),
            email: dto.email,
            login: dto.login,
            deletedAt: null,
            passwordHash,
            isConfirmed: false,
            confirmationCode: uuid(),
            expirationDate: add(new Date(), {
                days: 1,
            }),
            recoveryCode: null,
        };

        const user = await this.usersPostgresRepository.createUser(userModel);
        return 1;
    }
}
