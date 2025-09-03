import { PostDocument } from '../../domain/post/post.enity';
import { LikeStatusEnum } from '../../domain/const/LikeStatusEnum';

export class PostViewDto {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: LikeStatusEnum;
        newestLikes: {
            addedAt: Date;
            userId: string;
            login: string;
        }[];
    };

    static mapToView(post: PostDocument): PostViewDto {
        const dto = new PostViewDto();
        dto.id = post._id.toString();
        dto.title = post.title;
        dto.shortDescription = post.shortDescription;
        dto.content = post.content;
        dto.createdAt = post.createdAt;
        dto.blogId = post.blogId;
        dto.blogName = post.blogName;
        dto.extendedLikesInfo = {
            likesCount: post.extendedLikesInfo.likesCount,
            dislikesCount: post.extendedLikesInfo.dislikesCount,
            myStatus: LikeStatusEnum.None,
            newestLikes: [],
        };
        return dto;
    }
}
