import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentViewDto } from '../../api/view-dto/comments.view-dto';
import { CommentsQueryRepository } from '../../infastructure/query/comments.query-repository';
import { Types } from 'mongoose';
import { LikeStatusEnum } from '../../domain/const/LikeStatusEnum';
import { LikesCommentRepository } from '../../infastructure/likes-comment.repository';

export class GetCommentQuery {
    constructor(public dto: { commentId: string; userId?: string }) {}
}

@QueryHandler(GetCommentQuery)
export class GetCommentQueryHandler
    implements IQueryHandler<GetCommentQuery, CommentViewDto>
{
    constructor(
        private commentsQueryRepository: CommentsQueryRepository,
        private likesCommentRepository: LikesCommentRepository,
    ) {}

    async execute({ dto }: GetCommentQuery) {
        const comment =
            await this.commentsQueryRepository.getByIdOrNotFoundFail(
                dto.commentId,
            );
        if (dto.userId) {
            const likeComment =
                await this.likesCommentRepository.findByCommentIdAndUserId({
                    commentId: new Types.ObjectId(dto.commentId),
                    userId: new Types.ObjectId(dto.userId),
                });

            if (likeComment && likeComment?.status !== LikeStatusEnum.None) {
                comment.likesInfo.myStatus = likeComment.status;
            }
        }
        return comment;
    }
}
