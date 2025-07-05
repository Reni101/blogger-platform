import { Module } from '@nestjs/common';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { BlogPlatformModule } from './modules/blogers-platform/blog-platform.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/nest-bloggers-platform'),
        UserAccountsModule,
        BlogPlatformModule,
        TestingModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
