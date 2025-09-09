import { Module } from '@nestjs/common';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { BlogPlatformModule } from './modules/blogers-platform/blog-platform.module';
import * as process from 'node:process';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllHttpExceptionsFilter } from './core/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/domain-exceptions.filter';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        ThrottlerModule.forRoot({
            throttlers: [{ limit: 5, ttl: 10000 }],
        }),
        CqrsModule.forRoot(),
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URL ?? ''),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'swagger-static'),
            serveRoot:
                process.env.NODE_ENV === 'development' ? '/' : `/swagger`,
        }),

        UserAccountsModule,
        BlogPlatformModule,
        TestingModule,
        NotificationsModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllHttpExceptionsFilter,
        },
        {
            provide: APP_FILTER,
            useClass: DomainHttpExceptionsFilter,
        },
    ],
})
export class AppModule {}
