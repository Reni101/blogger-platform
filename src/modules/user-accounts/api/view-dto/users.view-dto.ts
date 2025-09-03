import { UserDocument } from '../../domain/user.entity';

export class UsersViewDto {
    id: string;
    login: string;
    email: string;
    createdAt: Date;

    static mapToView(user: UserDocument): UsersViewDto {
        const dto = new UsersViewDto();

        dto.email = user.email;
        dto.login = user.login;
        dto.id = user._id.toString();
        dto.createdAt = user.createdAt;
        return dto;
    }
}
