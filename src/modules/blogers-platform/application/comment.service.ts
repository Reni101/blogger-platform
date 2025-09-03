import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infastructure/comments.repository';

@Injectable()
export class CommentService {
    constructor(private readonly commentsRepository: CommentsRepository) {}

    async deleteComment(id: string) {
        const comment = await this.commentsRepository.findOrNotFoundFail(id);
        comment.makeDeleted();
        await this.commentsRepository.save(comment);
    }
}
