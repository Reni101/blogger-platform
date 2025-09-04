import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infastructure/comments.repository';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class CommentService {
    constructor(private readonly commentsRepository: CommentsRepository) {}

    async deleteComment(dto: { id: string; userId: string }) {
        const comment = await this.commentsRepository.findOrNotFoundFail(
            dto.id,
        );

        if (comment.commentatorInfo.userId.toString() !== dto.userId) {
            new DomainException({
                code: DomainExceptionCode.Forbidden,
                message: 'The comment does not belong to the user',
            });
        }

        comment.makeDeleted();
        await this.commentsRepository.save(comment);
    }

    async updateComment(dto: { id: string; userId: string; content: string }) {
        const comment = await this.commentsRepository.findOrNotFoundFail(
            dto.id,
        );

        if (comment.commentatorInfo.userId.toString() !== dto.userId) {
            new DomainException({
                code: DomainExceptionCode.Forbidden,
                message: 'The comment does not belong to the user',
            });
        }

        comment.updateComment({ content: dto.content });
        await this.commentsRepository.save(comment);
    }
}
