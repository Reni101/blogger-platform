import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CommentsQueryRepository } from '../infastructure/query/comments.query-repository';
import { CommentService } from '../application/comment.service';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../user-accounts/guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';
import {
    likeStatusCommentInputDto,
    UpdateCommentInputDto,
} from './input-dto/comments.input-dto';
import { CommandBus } from '@nestjs/cqrs';
import { LikeStatusCommentCommand } from '../application/use-cases/comments/like-status.use-case';

@Controller('comments')
export class CommentsController {
    constructor(
        private commentsQueryRepository: CommentsQueryRepository,
        private commentService: CommentService,
        private commandBus: CommandBus,
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
        return this.commentService.deleteComment({ id, userId: user.id });
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePost(
        @Param('id') id: string,
        @Body() body: UpdateCommentInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ) {
        return this.commentService.updateComment({
            id,
            userId: user.id,
            content: body.content,
        });
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put(':id/like-status')
    @HttpCode(HttpStatus.NO_CONTENT)
    async likeStatus(
        @Param('id') id: string,
        @Body() body: likeStatusCommentInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ) {
        return this.commandBus.execute<LikeStatusCommentCommand, void>(
            new LikeStatusCommentCommand({
                status: body.likeStatus,
                commentId: id,
                userId: user.id,
            }),
        );
    }
}
