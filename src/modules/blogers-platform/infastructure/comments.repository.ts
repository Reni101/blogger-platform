import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    Comment,
    CommentDocument,
    CommentModelType,
} from '../domain/comment/comment.entity';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class CommentsRepository {
    constructor(
        @InjectModel(Comment.name)
        private CommentModel: CommentModelType,
    ) {}

    async findById(id: string) {
        return this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async save(comment: CommentDocument) {
        await comment.save();
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
