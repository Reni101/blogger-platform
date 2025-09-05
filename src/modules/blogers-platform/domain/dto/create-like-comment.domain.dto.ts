import { LikeStatusEnum } from '../const/LikeStatusEnum';
import { Types } from 'mongoose';

export class CreateLikeCommentDomainDto {
    userId: Types.ObjectId;
    commentId: Types.ObjectId;
    status: LikeStatusEnum;
}
