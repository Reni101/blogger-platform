import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    async sendConfirmationEmail(email: string, code: string): Promise<void> {
        //can add html templates, implement advertising and other logic for mailing...

        const html = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
        </p>`;

        await this.mailerService.sendMail({
            html,
            subject: 'Registration',
            to: email,
        });
    }

    async resendEmail(email: string, code: string): Promise<void> {
        //can add html templates, implement advertising and other logic for mailing...

        const html = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
        </p>`;

        await this.mailerService.sendMail({
            html,
            subject: 'New code',
            to: email,
        });
    }
}
