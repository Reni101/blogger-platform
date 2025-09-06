import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LikesPostRepository } from '../../infastructure/likes-post.repository';
import { Types } from 'mongoose';
import { LikeStatusEnum } from '../../domain/const/LikeStatusEnum';
import { PostsQueryRepository } from '../../infastructure/query/posts.query-repository';
import { NewestLikesViewDto } from '../../api/view-dto/posts.view-dto';

export class GetPostQuery {
    constructor(public dto: { postId: string; userId?: string }) {}
}

@QueryHandler(GetPostQuery)
export class GetPostQueryHandler implements IQueryHandler<GetPostQuery> {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private likesPostRepository: LikesPostRepository,
    ) {}

    async execute({ dto }: GetPostQuery) {
        const post = await this.postsQueryRepository.getByIdOrNotFoundFail(
            dto.postId,
        );

        if (dto.userId) {
            const likePost =
                await this.likesPostRepository.findByPostIdAndUserId({
                    postId: new Types.ObjectId(dto.postId),
                    userId: new Types.ObjectId(dto.userId),
                });

            if (likePost && likePost?.status !== LikeStatusEnum.None) {
                post.extendedLikesInfo.myStatus = likePost.status;
            }
            const newLikest = await this.likesPostRepository.findNewReactions(
                dto.postId,
            );
            post.extendedLikesInfo.newestLikes = newLikest.map(
                NewestLikesViewDto.mapToView,
            );
        }

        return post;
    }
}
