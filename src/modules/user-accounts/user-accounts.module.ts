import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
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
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
            secret: process.env.SECRET_KEY,
            signOptions: { expiresIn: '5m' }, // Время жизни токена
        }),
    ],
    controllers: [UsersController, AuthController],
    providers: [
        UsersService,
        UsersQueryRepository,
        UsersRepository,
        CryptoService,

        AuthService,
        LocalStrategy,
    ],
})
export class UserAccountsModule {}
