import { LikeStatusEnum } from '../../domain/const/LikeStatusEnum';
import { CommentDocument } from '../../domain/comment/comment.entity';

export class CommentViewDto {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: Date;
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: LikeStatusEnum;
    };

    static mapToView(comment: CommentDocument): CommentViewDto {
        const dto = new CommentViewDto();
        dto.id = comment._id.toString();
        dto.content = comment.content;
        dto.commentatorInfo = {
            userId: comment.commentatorInfo.userId.toString(),
            userLogin: comment.commentatorInfo.userLogin,
        };
        dto.createdAt = comment.createdAt;
        dto.likesInfo = {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus: LikeStatusEnum.None,
        };
        return dto;
    }
}
