import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { BlogViewDto } from './view-dto/blogs.view-dto';
import { BlogsQueryRepository } from '../infastructure/query/blogs.query-repository';
import {
    CreateBlogInputDto,
    CreatePostByBlogIdInputDto,
    UpdateBlogInputDto,
} from './input-dto/blogs.input-dto';
import { BlogsService } from '../application/blogs.service';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { PostsQueryRepository } from '../infastructure/query/posts.query-repository';
import { PostsService } from '../application/posts.service';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';

@Controller('blogs')
export class BlogsControllers {
    constructor(
        private blogsQueryRepository: BlogsQueryRepository,
        private blogsService: BlogsService,
        private postsQueryRepository: PostsQueryRepository,
        private postsService: PostsService,
    ) {}

    @ApiParam({ name: 'id' })
    @Get(':id')
    async getById(@Param('id') id: string): Promise<BlogViewDto> {
        return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
    }

    @Post()
    async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
        const blogId = await this.blogsService.createBlog(body);
        return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
    }

    @ApiParam({ name: 'id' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlog(@Param('id') id: string): Promise<void> {
        return this.blogsService.deleteBlog(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateBlog(
        @Param('id') id: string,
        @Body() body: UpdateBlogInputDto,
    ): Promise<void> {
        return this.blogsService.updateBlog({ ...body, id: id });
    }

    @Get()
    async getAll(
        @Query() query: GetBlogsQueryParams,
    ): Promise<PaginatedViewDto<BlogViewDto[]>> {
        return this.blogsQueryRepository.getAll(query);
    }

    @ApiParam({ name: 'blogId' })
    @Post(':blogId/posts')
    async createPostByBlogId(
        @Param('blogId') blogId: string,
        @Body() body: CreatePostByBlogIdInputDto,
    ) {
        const postId = await this.postsService.createPost({ ...body, blogId });
        return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
    }
    @ApiParam({ name: 'blogId' })
    @Get(':blogId/posts')
    async getPostByBlogId(
        @Query() query: GetPostsQueryParams,
        @Param('blogId') blogId: string,
    ) {
        await this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
        return await this.postsQueryRepository.getPostsByBlogId(query, blogId);
    }
}
