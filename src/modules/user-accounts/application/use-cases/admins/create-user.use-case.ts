import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../dto/create-user.dto';
import {
    DomainException,
    Extension,
} from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { UsersRepository } from '../../../infastructure/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../../../domain/user.entity';
import { CryptoService } from '../../crypto.service';

@Injectable()
export class CreateUserUseCase {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
        private readonly usersRepository: UsersRepository,
        private cryptoService: CryptoService,
    ) {}

    async execute(dto: CreateUserDto) {
        const { login, email } = dto;
        const uniqueUser = await this.usersRepository.findUniqueUser(
            login,
            email,
        );

        this.validateUniqueUser(uniqueUser, { login, email });

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

    private validateUniqueUser(
        uniqueUser: UserDocument | null,
        dto: { login: string; email: string },
    ) {
        if (uniqueUser) {
            const extensions: Extension[] = [];
            if (uniqueUser.login === dto.login) {
                extensions.push({
                    field: 'login',
                    message: 'login already exists',
                });
            }
            if (uniqueUser.email === dto.email) {
                extensions.push({
                    field: 'email',
                    message: 'email already exists',
                });
            }

            throw new DomainException({
                code: DomainExceptionCode.BadRequest,
                message: 'error creating users',
                extensions,
            });
        }
    }
}
