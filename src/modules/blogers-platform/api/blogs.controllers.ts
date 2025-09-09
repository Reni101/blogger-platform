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
    UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
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
import { BasicAuthGuard } from '../../user-accounts/guards/basic/bacis-auth.guard';
import { QueryBus } from '@nestjs/cqrs';
import { GetPostsQuery } from '../application/queries/get-posts.query';
import { ExtractUserIfExistsFromRequest } from '../../user-accounts/guards/decorators/extract-user-if-exists-from-request.decorator';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';
import { JwtOptionalAuthGuard } from '../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { PostViewDto } from './view-dto/posts.view-dto';

@Controller('blogs')
export class BlogsControllers {
    constructor(
        private blogsQueryRepository: BlogsQueryRepository,
        private blogsService: BlogsService,
        private postsQueryRepository: PostsQueryRepository,
        private postsService: PostsService,
        private queryBus: QueryBus,
    ) {}

    @ApiParam({ name: 'id' })
    @Get(':id')
    async getById(@Param('id') id: string): Promise<BlogViewDto> {
        return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
    }

    @UseGuards(BasicAuthGuard)
    @ApiBasicAuth()
    @Post()
    async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
        const blogId = await this.blogsService.createBlog(body);
        return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
    }

    @UseGuards(BasicAuthGuard)
    @ApiBasicAuth()
    @ApiParam({ name: 'id' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlog(@Param('id') id: string): Promise<void> {
        return this.blogsService.deleteBlog(id);
    }

    @UseGuards(BasicAuthGuard)
    @ApiBasicAuth()
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

    @UseGuards(BasicAuthGuard)
    @ApiBasicAuth()
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
    @ApiOperation({ summary: 'if there is a token it will return the status' })
    @UseGuards(JwtOptionalAuthGuard)
    @Get(':blogId/posts')
    async getPostsByBlogId(
        @Query() query: GetPostsQueryParams,
        @Param('blogId') blogId: string,
        @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
    ) {
        return this.queryBus.execute<
            GetPostsQuery,
            PaginatedViewDto<PostViewDto[]>
        >(new GetPostsQuery({ query, blogId, userId: user?.id }));
    }
}
