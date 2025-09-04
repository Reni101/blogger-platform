import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CommentsQueryRepository } from '../infastructure/query/comments.query-repository';
import { CommentService } from '../application/comment.service';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../user-accounts/guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';

@Controller('comments')
export class CommentsController {
    constructor(
        private commentsQueryRepository: CommentsQueryRepository,
        private commentService: CommentService,
    ) {}

    @ApiParam({ name: 'id' })
    @Get(':id')
    async getById(@Param('id') id: string) {
        return this.commentsQueryRepository.getByIdOrNotFoundFail(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiParam({ name: 'id' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteComment(
        @Param('id') id: string,
        @ExtractUserFromRequest() user: UserContextDto,
    ) {
        return this.commentService.deleteComment(id);
    }
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
