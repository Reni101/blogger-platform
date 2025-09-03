import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    CommentDocument,
    CommentModelType,
} from '../domain/comment/comment.entity';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { Comment } from '../domain/comment/comment.entity';

@Injectable()
export class CommentsRepository {
    constructor(
        @InjectModel(Comment.name) private CommentModel: CommentModelType,
    ) {}

    async findById(id: string): Promise<CommentDocument | null> {
        return this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async save(post: CommentDocument) {
        await post.save();
    }

    async findOrNotFoundFail(id: string): Promise<CommentDocument> {
        const comment = await this.findById(id);

        if (!comment) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'users not found',
            });
        }

        return comment;
    }
}
