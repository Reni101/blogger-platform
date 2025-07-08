import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, PostModelType } from '../../domain/post.enity';
import { PostViewDto } from '../../api/view-dto/posts.view-dto';

@Injectable()
export class PostsQueryRepository {
    constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

    // async getAll(
    //     query: GetBlogsQueryParams,
    // ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    //     const filter: FilterQuery<Blog> = {
    //         deletedAt: null,
    //     };
    //
    //     if (query.searchNameTerm) {
    //         filter.$or = filter.$or || [];
    //         filter.$or.push({
    //             name: { $regex: query.searchNameTerm, $options: 'i' },
    //         });
    //     }
    //
    //     const users = await this.BlogModel.find(filter)
    //         .sort({ [query.sortBy]: query.sortDirection })
    //         .skip(query.calculateSkip())
    //         .limit(query.pageSize)
    //         .lean();
    //
    //     const totalCount = await this.BlogModel.countDocuments(filter);
    //
    //     const items = users.map(BlogViewDto.mapToView);
    //
    //     return PaginatedViewDto.mapToView({
    //         items,
    //         totalCount,
    //         page: query.pageNumber,
    //         size: query.pageSize,
    //     });
    // }

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
