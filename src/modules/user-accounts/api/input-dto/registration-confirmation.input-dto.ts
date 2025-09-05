import { IsEmail, IsString, IsUUID } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';

export class RegistrationConfirmationInputDto {
    @Trim()
    @IsString()
    @IsUUID()
    code: string;
}

export class RegistrationEmailResendingInputDto {
    @Trim()
    @IsEmail()
    email: string;
}
