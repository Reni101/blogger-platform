import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    LikeComment,
    LikeCommentDocument,
    LikeCommentModelType,
} from '../domain/comment/likes-comment.entity';
import { Types } from 'mongoose';

@Injectable()
export class LikesCommentRepository {
    constructor(
        @InjectModel(LikeComment.name)
        private likeCommentModelType: LikeCommentModelType,
    ) {}

    async findByCommentIdAndUserId(dto: {
        commentId: Types.ObjectId;
        userId: Types.ObjectId;
    }) {
        return this.likeCommentModelType.findOne({
            userId: dto.userId,
            commentId: dto.commentId,
        });
    }

    async save(comment: LikeCommentDocument) {
        await comment.save();
    }

    // async findOrNotFoundFail(id: string): Promise<LikeCommentDocument> {
    //     const comment = await this.findById(id);
    //
    //     if (!comment) {
    //         throw new DomainException({
    //             code: DomainExceptionCode.NotFound,
    //             message: ' not found',
    //         });
    //     }
    //
    //     return comment;
    // }
}
