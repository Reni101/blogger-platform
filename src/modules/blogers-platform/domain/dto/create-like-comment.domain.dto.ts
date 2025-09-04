import { LikeStatusEnum } from '../const/LikeStatusEnum';

export class CreateLikeCommentDomainDto {
    userId: string;
    commentId: string;
    status: LikeStatusEnum;
}
