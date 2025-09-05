import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentViewDto } from '../../api/view-dto/comments.view-dto';
import { CommentsQueryRepository } from '../../infastructure/query/comments.query-repository';
import { LikesCommentRepository } from '../../infastructure/likes-comment.repository';
import { GetCommentsQueryParams } from '../../api/input-dto/get-comments-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { Types } from 'mongoose';
import { LikeStatusEnum } from '../../domain/const/LikeStatusEnum';

export class GetCommentsByPostIdQuery {
    constructor(
        public dto: {
            postId: string;
            userId?: string;
            query: GetCommentsQueryParams;
        },
    ) {}
}

@QueryHandler(GetCommentsByPostIdQuery)
export class GetCommentsByPostIdQueryHandler
    implements
        IQueryHandler<
            GetCommentsByPostIdQuery,
            PaginatedViewDto<CommentViewDto[]>
        >
{
    constructor(
        private commentsQueryRepository: CommentsQueryRepository,
        private likesCommentRepository: LikesCommentRepository,
    ) {}

    async execute({ dto }: GetCommentsByPostIdQuery) {
        const comments = await this.commentsQueryRepository.getAll(dto.query);
        if (dto.userId) {
            for (const comment of comments.items) {
                const likeComment =
                    await this.likesCommentRepository.findByCommentIdAndUserId({
                        commentId: new Types.ObjectId(comment.id),
                        userId: new Types.ObjectId(dto.userId),
                    });

                if (likeComment) {
                    if (likeComment?.status !== LikeStatusEnum.None) {
                        comment.likesInfo.myStatus = likeComment.status;
                    }
                }
            }
        }
        return comments;
    }
}
