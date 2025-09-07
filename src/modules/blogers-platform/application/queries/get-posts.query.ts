import { GetPostsQueryParams } from '../../api/input-dto/get-posts-query-params.input-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import {
    NewestLikesViewDto,
    PostViewDto,
} from '../../api/view-dto/posts.view-dto';
import { BlogsQueryRepository } from '../../infastructure/query/blogs.query-repository';
import { PostsQueryRepository } from '../../infastructure/query/posts.query-repository';
import { Types } from 'mongoose';
import { LikesPostRepository } from '../../infastructure/likes-post.repository';
import { LikeStatusEnum } from '../../domain/const/LikeStatusEnum';

export class GetPostsQuery {
    constructor(
        public dto: {
            query: GetPostsQueryParams;
            userId?: string;
            blogId?: string;
        },
    ) {}
}

@QueryHandler(GetPostsQuery)
export class GetPostsQueryHandler
    implements IQueryHandler<GetPostsQuery, PaginatedViewDto<PostViewDto[]>>
{
    constructor(
        private blogsQueryRepository: BlogsQueryRepository,
        private postsQueryRepository: PostsQueryRepository,
        private likesPostRepository: LikesPostRepository,
    ) {}

    async execute({ dto }: GetPostsQuery) {
        if (dto.blogId) {
            await this.blogsQueryRepository.getByIdOrNotFoundFail(dto.blogId);
        }
        const posts = await this.postsQueryRepository.getAll(
            dto.query,
            dto.blogId,
        );

        if (dto.userId) {
            for (const post of posts.items) {
                const likePost =
                    await this.likesPostRepository.findByPostIdAndUserId({
                        postId: new Types.ObjectId(post.id),
                        userId: new Types.ObjectId(dto.userId),
                    });

                if (likePost && likePost?.status !== LikeStatusEnum.None) {
                    post.extendedLikesInfo.myStatus = likePost.status;
                }
                const newLikest =
                    await this.likesPostRepository.findNewReactions(post.id);
                post.extendedLikesInfo.newestLikes = newLikest.map(
                    NewestLikesViewDto.mapToView,
                );
            }
        }

        return posts;
    }
}
