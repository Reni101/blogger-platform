import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { CommentsQueryRepository } from '../infastructure/query/comments.query-repository';

@Controller('comments')
export class CommentsController {
    constructor(private commentsQueryRepository: CommentsQueryRepository) {} // private postsService: PostsService, //
    //
    // @Post()
    // async createPost(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
    //     const postId = await this.postsService.createPost(body);
    //     return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
    // }

    @ApiParam({ name: 'id' })
    @Get(':id')
    async getById(@Param('id') id: string) {
        return this.commentsQueryRepository.getByIdOrNotFoundFail(id);
    }

    // @ApiParam({ name: 'id' })
    // @Delete(':id')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // async deletePost(@Param('id') id: string): Promise<void> {
    //     return this.postsService.deletePost(id);
    // }
    //
    // @Put(':id')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // async updatePost(
    //     @Param('id') id: string,
    //     @Body() body: UpdatePostInputDto,
    // ): Promise<void> {
    //     return this.postsService.updatePost({ ...body, id: id });
    // }
    // @Get()
    // async getAll(
    //     @Query() query: GetPostsQueryParams,
    // ): Promise<PaginatedViewDto<PostViewDto[]>> {
    //     return this.postsQueryRepository.getAll(query);
    // }
}
