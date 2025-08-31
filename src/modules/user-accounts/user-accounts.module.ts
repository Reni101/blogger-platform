import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersQueryRepository } from './infastructure/query/users.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infastructure/users.repository';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';
import { CryptoService } from './application/crypto.service';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { LocalStrategy } from './guards/local/local.strategy';
import { NotificationsModule } from '../notifications/notifications.module';
import { CreateUserUseCase } from './application/use-cases/admins/create-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/users/register-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/admins/delete-user.use-case';
import { UsersService } from './application/users.service';

const usersUseCases = [
    CreateUserUseCase,
    RegisterUserUseCase,
    DeleteUserUseCase,
];

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
            secret: process.env.SECRET_KEY,
            signOptions: { expiresIn: '5m' }, // Время жизни токена
        }),
        NotificationsModule,
    ],
    controllers: [UsersController, AuthController],
    providers: [
        UsersService,
        UsersQueryRepository,
        UsersRepository,
        CryptoService,

        AuthService,
        LocalStrategy,
        ...usersUseCases,
    ],
})
export class UserAccountsModule {}
