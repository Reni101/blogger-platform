import { LikeStatusEnum } from '../const/LikeStatusEnum';
import { Types } from 'mongoose';

export class CreateLikePostDomainDto {
    userId: Types.ObjectId;
    postId: Types.ObjectId;
    status: LikeStatusEnum;
    login: string;
}
