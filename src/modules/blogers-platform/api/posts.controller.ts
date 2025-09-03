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
import {
    CreatePostInputDto,
    UpdatePostInputDto,
} from './input-dto/posts.input-dto';
import { PostsService } from '../application/posts.service';
import { PostViewDto } from './view-dto/posts.view-dto';
import { PostsQueryRepository } from '../infastructure/query/posts.query-repository';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';

@Controller('posts')
export class PostsController {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private postsService: PostsService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    async createPost(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
        const postId = await this.postsService.createPost(body);
        return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
    }

    @ApiParam({ name: 'id' })
    @Get(':id')
    async getById(@Param('id') id: string): Promise<PostViewDto> {
        return this.postsQueryRepository.getByIdOrNotFoundFail(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiParam({ name: 'id' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePost(@Param('id') id: string): Promise<void> {
        return this.postsService.deletePost(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePost(
        @Param('id') id: string,
        @Body() body: UpdatePostInputDto,
    ): Promise<void> {
        return this.postsService.updatePost({ ...body, id: id });
    }
    @Get()
    async getAll(
        @Query() query: GetPostsQueryParams,
    ): Promise<PaginatedViewDto<PostViewDto[]>> {
        return this.postsQueryRepository.getAll(query);
    }
}
