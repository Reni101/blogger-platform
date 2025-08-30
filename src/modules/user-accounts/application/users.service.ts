import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infastructure/users.repository';

@Injectable()
export class UsersService {
    constructor(
        // @InjectModel(User.name) private UserModel: UserModelType,
        // private cryptoService: CryptoService,
        private usersRepository: UsersRepository,
    ) {}
    // async createUser(dto: CreateUserDto) {
    //     const uniqueUser = await this.usersRepository.findUniqueUser(
    //         dto.login,
    //         dto.email,
    //     );
    //
    //     if (uniqueUser) {
    //         const extensions: Extension[] = [];
    //         if (uniqueUser.login === dto.login) {
    //             extensions.push({
    //                 field: 'login',
    //                 message: 'login already exists',
    //             });
    //         }
    //         if (uniqueUser.email === dto.email) {
    //             extensions.push({
    //                 field: 'email',
    //                 message: 'email already exists',
    //             });
    //         }
    //
    //         throw new DomainException({
    //             code: DomainExceptionCode.BadRequest,
    //             message: 'error creating users',
    //             extensions,
    //         });
    //     }
    //
    //     const passwordHash = await this.cryptoService.createPasswordHash(
    //         dto.password,
    //     );
    //
    //     const users = this.UserModel.createInstance({
    //         email: dto.email,
    //         login: dto.login,
    //         passwordHash: passwordHash,
    //     });
    //
    //     await this.usersRepository.save(users);
    //     return users._id.toString();
    // }

    async deleteUser(id: string) {
        const user = await this.usersRepository.findOrNotFoundFail(id);
        user.makeDeleted();
        await this.usersRepository.save(user);
    }

    // async registerUser(dto: CreateUserDto) {
    //
    //
    //     // const userId = await this.createUser(dto);
    //     // const user = await this.usersRepository.findOrNotFoundFail(userId);
    //
    //     this.emailService
    //         .sendConfirmationEmail(
    //             user.email,
    //             user.emailConfirmation.confirmationCode,
    //         )
    //         .catch(console.error);
    // }
}
