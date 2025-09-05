import { CreateUserDto } from '../../dto/create-user.dto';
import { IsEmail, IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';
import {
    loginConstraints,
    passwordConstraints,
} from '../../domain/user.entity';

export class CreateUserInputDto implements CreateUserDto {
    @Trim()
    @IsString()
    @Length(loginConstraints.minLength, loginConstraints.maxLength)
    login: string;

    @Trim()
    @IsString()
    @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
    password: string;

    @Trim()
    @IsString()
    @IsEmail()
    email: string;
}
