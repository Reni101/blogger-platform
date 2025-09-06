import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../infastructure/comments.repository';
import { CreateLikeCommentDomainDto } from '../../../domain/dto/create-like-comment.domain.dto';
import { LikesCommentRepository } from '../../../infastructure/likes-comment.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
    LikeComment,
    LikeCommentModelType,
} from '../../../domain/comment/likes-comment.entity';
import { LikeStatusEnum } from '../../../domain/const/LikeStatusEnum';

export class LikeStatusCommentCommand {
    constructor(public dto: CreateLikeCommentDomainDto) {}
}
@CommandHandler(LikeStatusCommentCommand)
export class LikeStatusCommentUseCase
    implements ICommandHandler<LikeStatusCommentCommand>
{
    constructor(
        private commentsRepository: CommentsRepository,
        private likesCommentRepository: LikesCommentRepository,
        @InjectModel(LikeComment.name)
        private likeCommentModelType: LikeCommentModelType,
    ) {}

    async execute({ dto }: LikeStatusCommentCommand) {
        const { commentId, status, userId } = dto;
        const comment =
            await this.commentsRepository.findOrNotFoundFail(commentId);

        const like = await this.likesCommentRepository.findByCommentIdAndUserId(
            { userId, commentId },
        );
        if (!like) {
            const like = this.likeCommentModelType.createInstance(dto);
            await this.likesCommentRepository.save(like);
            comment.incrementLikeCount(status, 1);
            await this.commentsRepository.save(comment);
            return;
        }

        if (like && status === LikeStatusEnum.None) {
            comment.incrementLikeCount(like.status, -1);
            await this.commentsRepository.save(comment);
            await like.deleteOne();
            return;
        }
        if (like.status !== dto.status) {
            like.updateLike(status);
            await this.likesCommentRepository.save(like);
            comment.toggleCount(status);
            await this.commentsRepository.save(comment);
            return;
        }

        return;
    }
}
