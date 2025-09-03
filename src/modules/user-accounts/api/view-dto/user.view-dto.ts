import { UserDocument } from '../../domain/user.entity';

export class UserViewDto {
    userId: string;
    login: string;
    email: string;

    static mapToView(user: UserDocument): UserViewDto {
        const dto = new UserViewDto();

        dto.email = user.email;
        dto.login = user.login;
        dto.userId = user._id.toString();
        return dto;
    }
}
