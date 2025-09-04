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
        await this.commentsRepository.findOrNotFoundFail(commentId);

        const like = await this.likesCommentRepository.findByCommentIdAndUserId(
            { userId: userId, commentId },
        );
        if (!like) {
            await this.createLike(dto);
            await this.incrementData({ status, commentId, value: 1 });
            return;
        }

        if (like && status === LikeStatusEnum.None) {
            await this.incrementData({ status, commentId, value: -1 });
            await like.deleteOne();
            return;
        }
        if (like.status !== dto.status) {
            like.updateLike(status);
            await this.likesCommentRepository.save(like);
            if (dto.status === LikeStatusEnum.Like) {
                await this.commentsRepository.toggleLike(commentId);
            } else {
                await this.commentsRepository.toggleDislike(commentId);
            }
        }

        return;
    }

    private async createLike(dto: CreateLikeCommentDomainDto) {
        const like = this.likeCommentModelType.createInstance(dto);
        await this.likesCommentRepository.save(like);
    }
    private async incrementData(dto: {
        status: LikeStatusEnum;
        commentId: string;
        value: number;
    }) {
        const { commentId, status, value } = dto;
        if (status === LikeStatusEnum.Like) {
            await this.commentsRepository.incrementLike(commentId, value);
        } else {
            await this.commentsRepository.incrementDislike(commentId, value);
        }
    }
}
