import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.mail.ru',
                port: 465,
                secure: true, // true для 465, false для других портов
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASS,
                },
            },
            defaults: { from: process.env.EMAIL },
        }),
    ],
    controllers: [],
    providers: [EmailService],
    exports: [EmailService],
})
export class NotificationsModule {}
