import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog, BlogModelType } from '../../domain/blog.entity';
import { BlogViewDto } from '../../api/view-dto/blogs.view-dto';

@Injectable()
export class BlogsQueryRepository {
    constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

    // async getAll(
    //     query: GetUsersQueryParams,
    // ): Promise<PaginatedViewDto<UserViewDto[]>> {
    //     const filter: FilterQuery<User> = {
    //         deletedAt: null,
    //     };
    //
    //     if (query.searchLoginTerm) {
    //         filter.$or = filter.$or || [];
    //         filter.$or.push({
    //             login: { $regex: query.searchLoginTerm, $options: 'i' },
    //         });
    //     }
    //
    //     if (query.searchEmailTerm) {
    //         filter.$or = filter.$or || [];
    //         filter.$or.push({
    //             email: { $regex: query.searchEmailTerm, $options: 'i' },
    //         });
    //     }
    //
    //     const users = await this.UserModel.find(filter)
    //         .sort({ [query.sortBy]: query.sortDirection })
    //         .skip(query.calculateSkip())
    //         .limit(query.pageSize)
    //         .lean();
    //     const totalCount = await this.UserModel.countDocuments(filter);
    //
    //     const items = users.map(UserViewDto.mapToView);
    //
    //     return PaginatedViewDto.mapToView({
    //         items,
    //         totalCount,
    //         page: query.pageNumber,
    //         size: query.pageSize,
    //     });
    // }

    async getByIdOrNotFoundFail(id: string): Promise<BlogViewDto> {
        const blog = await this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        });

        if (!blog) {
            throw new NotFoundException('blog not found');
        }

        return BlogViewDto.mapToView(blog);
    }
}
