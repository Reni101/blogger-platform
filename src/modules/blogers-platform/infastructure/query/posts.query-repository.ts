import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, PostModelType } from '../../domain/post.enity';
import { PostViewDto } from '../../api/view-dto/posts.view-dto';
import { GetPostsQueryParams } from '../../api/input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class PostsQueryRepository {
    constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

    async getAll(
        query: GetPostsQueryParams,
    ): Promise<PaginatedViewDto<PostViewDto[]>> {
        const filter: FilterQuery<Post> = {
            deletedAt: null,
        };

        const users = await this.PostModel.find(filter)
            .sort({ [query.sortBy]: query.sortDirection })
            .skip(query.calculateSkip())
            .limit(query.pageSize)
            .lean();

        const totalCount = await this.PostModel.countDocuments(filter);

        const items = users.map(PostViewDto.mapToView);

        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: query.pageNumber,
            size: query.pageSize,
        });
    }

    async getByIdOrNotFoundFail(id: string): Promise<PostViewDto> {
        const post = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        });

        if (!post) {
            throw new NotFoundException('post not found');
        }

        return PostViewDto.mapToView(post);
    }
}
