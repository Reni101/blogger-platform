import { IsEmail } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';

export class PasswordRecoveryInputDto {
    @Trim()
    @IsEmail()
    email: string;
}
