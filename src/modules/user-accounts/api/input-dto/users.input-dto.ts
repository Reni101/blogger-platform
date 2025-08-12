import { CreateUserDto } from '../../dto/create-user.dto';
import { IsEmail, IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';

export class CreateUserInputDto implements CreateUserDto {
    @IsString()
    @Length(0, 2)
    @Trim()
    login: string;
    password: string;

    @IsString()
    @IsEmail()
    @Trim()
    email: string;
}
