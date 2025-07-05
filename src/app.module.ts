import { Module } from '@nestjs/common';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { BlogPlatformModule } from './modules/blogers-platform/blog-platform.module';
import * as process from 'node:process';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(
            `${process.env.MONGO_URL}/${process.env.DB_NAME}`,
        ),
        UserAccountsModule,
        BlogPlatformModule,
        TestingModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
