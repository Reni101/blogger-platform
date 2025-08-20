import { CreateUserDto } from '../../dto/create-user.dto';
import { IsEmail, IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';
import {
    loginConstraints,
    passwordConstraints,
} from '../../domain/user.entity';

export class CreateUserInputDto implements CreateUserDto {
    @IsString()
    @Length(loginConstraints.minLength, loginConstraints.maxLength)
    @Trim()
    login: string;

    @IsString()
    @Length(passwordConstraints.minLength, passwordConstraints.minLength)
    @Trim()
    password: string;

    @IsString()
    @IsEmail()
    @Trim()
    // @Matches(emailConstraints.match)
    email: string;
}
