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
import { LoginUserUseCase } from './application/use-cases/auth/login.use-case';
import { RegistrationConfirmationUseCase } from './application/use-cases/auth/registration-confirmation.use-case';
import { RegistrationEmailResendingUseCase } from './application/use-cases/auth/registration-email-resending.use-case';
import { NewPasswordUseCase } from './application/use-cases/auth/new-password.use-case';
import { PasswordRecoveryUseCase } from './application/use-cases/auth/password-recovery.use-case';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { UsersExternalRepository } from './infastructure/external/users.external-repository';
import { SecurityDevicesController } from './api/security-devices.controller';
import { RefreshTokenUseCase } from './application/use-cases/auth/refresh-token.use-case';
import { Session, SessionSchema } from './domain/session.entity';
import { SessionsRepository } from './infastructure/sessions.repository';
import { SessionsService } from './application/sessions.service';
import { LogoutUseCase } from './application/use-cases/auth/logout.use-case';

const usersUseCases = [
    CreateUserUseCase,
    RegisterUserUseCase,
    DeleteUserUseCase,
];

const authUseCases = [
    LoginUserUseCase,
    RefreshTokenUseCase,
    RegistrationConfirmationUseCase,
    RegistrationEmailResendingUseCase,
    PasswordRecoveryUseCase,
    NewPasswordUseCase,
    LogoutUseCase,
];

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Session.name, schema: SessionSchema },
        ]),
        JwtModule.register({
            secret: process.env.SECRET_KEY,
            signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN },
        }),
        NotificationsModule,
    ],
    controllers: [UsersController, AuthController, SecurityDevicesController],
    providers: [
        UsersService,
        UsersQueryRepository,
        UsersRepository,
        CryptoService,
        AuthService,
        LocalStrategy,
        ...usersUseCases,
        ...authUseCases,
        JwtStrategy,
        UsersExternalRepository,

        SessionsService,
        SessionsRepository,
    ],
    exports: [JwtStrategy, UsersExternalRepository],
})
export class UserAccountsModule {}
