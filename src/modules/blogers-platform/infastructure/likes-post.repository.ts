import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
    LikePost,
    LikePostDocument,
    LikePostModelType,
} from '../domain/post/likes-post.entity';
import { LikeStatusEnum } from '../domain/const/LikeStatusEnum';

@Injectable()
export class LikesPostRepository {
    constructor(
        @InjectModel(LikePost.name)
        private likePostModelType: LikePostModelType,
    ) {}

    async findByPostIdAndUserId(dto: {
        postId: Types.ObjectId;
        userId: Types.ObjectId;
    }) {
        return this.likePostModelType.findOne({
            userId: dto.userId,
            postId: dto.postId,
        });
    }

    async save(comment: LikePostDocument) {
        await comment.save();
    }

    async findNewReactions(postId: string) {
        return this.likePostModelType
            .find({
                postId: new Types.ObjectId(postId),
                status: LikeStatusEnum.Like,
            })
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();
    }
}
