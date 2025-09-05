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
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { CreateCommentInputDto } from './input-dto/comments.input-dto';
import { ExtractUserFromRequest } from '../../user-accounts/guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../application/use-cases/comments/create-comment.use-case';
import { CommentsQueryRepository } from '../infastructure/query/comments.query-repository';
import { JwtOptionalAuthGuard } from '../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { GetCommentsQueryParams } from './input-dto/get-comments-query-params.input-dto';
import { CommentViewDto } from './view-dto/comments.view-dto';
import { ExtractUserIfExistsFromRequest } from '../../user-accounts/guards/decorators/param/extract-user-if-exists-from-request.decorator';
import { GetCommentsByPostIdQuery } from '../application/queries/get-comments-by-postId.query';

@Controller('posts')
export class PostsController {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private commentsQueryRepository: CommentsQueryRepository,
        private postsService: PostsService,
        private commandBus: CommandBus,
        private queryBus: QueryBus,
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

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiParam({
        name: 'postId',
        content: {
            postId: {
                example: '68b930c0b1eea6deab39cb09',
                schema: { type: 'string' },
            },
        },
    })
    @Post(':postId/comments')
    async createComment(
        @Param('postId') postId: string,
        @Body() body: CreateCommentInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ) {
        const dto = { postId: postId, content: body.content, userId: user.id };

        const commentId = await this.commandBus.execute<
            CreateCommentCommand,
            string
        >(new CreateCommentCommand(dto));

        return this.commentsQueryRepository.getByIdOrNotFoundFail(commentId);
    }

    @Get(':postId/comments')
    @ApiParam({
        name: 'postId',
        content: {
            postId: {
                example: '68b930c0b1eea6deab39cb09',
                schema: { type: 'string' },
            },
        },
    })
    @ApiOperation({ summary: 'if there is a token it will return the status' })
    @UseGuards(JwtOptionalAuthGuard)
    @ApiBearerAuth()
    async getCommentsByPostId(
        @Query() query: GetCommentsQueryParams,
        @Param('postId') postId: string,
        @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
    ) {
        return this.queryBus.execute<
            GetCommentsByPostIdQuery,
            PaginatedViewDto<CommentViewDto[]>
        >(new GetCommentsByPostIdQuery({ postId, userId: user?.id, query }));
    }
}
