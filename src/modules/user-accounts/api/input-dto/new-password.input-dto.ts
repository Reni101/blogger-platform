import { IsString, IsUUID, Length } from 'class-validator';
import { passwordConstraints } from '../../domain/user.entity';
import { Trim } from '../../../../core/decorators/transform/trim';

export class NewPasswordInputDto {
    @Trim()
    @IsString()
    @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
    newPassword: string;

    @Trim()
    @IsString()
    @IsUUID()
    recoveryCode: string;
}
