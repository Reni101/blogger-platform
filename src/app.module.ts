import { Module } from '@nestjs/common';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/nest-bloggers-platform'),
        UserAccountsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}

// (
//     `${process.env.MONGO_URL}/${process.env.DB_NAME}`,
// )
