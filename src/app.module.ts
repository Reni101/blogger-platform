import { Module } from '@nestjs/common';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';

@Module({
    imports: [UserAccountsModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
