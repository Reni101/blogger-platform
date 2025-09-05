import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    Comment,
    CommentDocument,
    CommentModelType,
} from '../domain/comment/comment.entity';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { Types } from 'mongoose';

@Injectable()
export class CommentsRepository {
    constructor(
        @InjectModel(Comment.name)
        private CommentModel: CommentModelType,
    ) {}

    async findById(id: Types.ObjectId) {
        return this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async save(comment: CommentDocument) {
        await comment.save();
    }

    async findOrNotFoundFail(id: Types.ObjectId): Promise<CommentDocument> {
        const comment = await this.findById(id);

        if (!comment) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'comment not found',
            });
        }

        return comment;
    }

    async incrementLike(commentId: Types.ObjectId, value: number) {
        return this.CommentModel.findByIdAndUpdate(
            { _id: commentId },
            { $inc: { 'likesInfo.likesCount': value } },
        );
    }
    async incrementDislike(commentId: Types.ObjectId, value: number) {
        return this.CommentModel.findByIdAndUpdate(
            { _id: commentId },
            { $inc: { 'likesInfo.dislikesCount': value } },
        );
    }
    async toggleLike(commentId: Types.ObjectId) {
        await this.CommentModel.findByIdAndUpdate(
            { _id: commentId },
            {
                $inc: {
                    'likesInfo.likesCount': +1,
                    'likesInfo.dislikesCount': -1,
                },
            },
        );
    }
    async toggleDislike(commentId: Types.ObjectId) {
        await this.CommentModel.findByIdAndUpdate(
            { _id: commentId },
            {
                $inc: {
                    'likesInfo.likesCount': -1,
                    'likesInfo.dislikesCount': +1,
                },
            },
        );
    }
}
