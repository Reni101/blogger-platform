import { Module } from '@nestjs/common';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { BlogPlatformModule } from './modules/blogers-platform/blog-platform.module';
import * as process from 'node:process';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { APP_FILTER } from '@nestjs/core';
import { AllHttpExceptionsFilter } from './core/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/domain-exceptions.filter';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GLOBAL_PREFIX } from './setup/global-prefix.setup';

@Module({
    imports: [
        ConfigModule.forRoot(),
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
    controllers: [AppController],
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
