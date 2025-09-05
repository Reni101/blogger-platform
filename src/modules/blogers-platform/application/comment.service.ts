import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infastructure/comments.repository';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { Types } from 'mongoose';

@Injectable()
export class CommentService {
    constructor(private readonly commentsRepository: CommentsRepository) {}

    async deleteComment(dto: { id: string; userId: string }) {
        const comment = await this.commentsRepository.findOrNotFoundFail(
            new Types.ObjectId(dto.id),
        );
        const commentOwnerId = comment.commentatorInfo.userId.toString();
        this.validateCommentOwner(commentOwnerId, dto.userId);

        comment.makeDeleted();
        await this.commentsRepository.save(comment);
    }

    async updateComment(dto: {
        commentId: string;
        userId: string;
        content: string;
    }) {
        const comment = await this.commentsRepository.findOrNotFoundFail(
            new Types.ObjectId(dto.commentId),
        );
        const commentOwnerId = comment.commentatorInfo.userId.toString();
        this.validateCommentOwner(commentOwnerId, dto.userId);

        comment.updateComment({ content: dto.content });
        await this.commentsRepository.save(comment);
    }

    private validateCommentOwner(commentOwnerId: string, userId: string) {
        if (commentOwnerId !== userId) {
            throw new DomainException({
                code: DomainExceptionCode.Forbidden,
                message: 'The comment does not belong to the user',
            });
        }
    }
}
