import { BlogDocument } from '../../domain/blog.entity';

export class BlogViewDto {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;

    static mapToView(user: BlogDocument): BlogViewDto {
        const dto = new BlogViewDto();
        dto.id = user._id.toString();
        dto.name = user.name;
        dto.description = user.description;
        dto.websiteUrl = user.websiteUrl;
        dto.createdAt = user.createdAt;
        dto.isMembership = user.isMembership;
        return dto;
    }
}
