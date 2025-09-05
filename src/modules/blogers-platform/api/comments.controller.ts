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
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CommentService } from '../application/comment.service';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../user-accounts/guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';
import {
    likeStatusCommentInputDto,
    UpdateCommentInputDto,
} from './input-dto/comments.input-dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LikeStatusCommentCommand } from '../application/use-cases/comments/like-status.use-case';
import { JwtOptionalAuthGuard } from '../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../user-accounts/guards/decorators/param/extract-user-if-exists-from-request.decorator';
import { Types } from 'mongoose';
import { GetCommentQuery } from '../application/queries/get-comment.query';
import { CommentViewDto } from './view-dto/comments.view-dto';

@Controller('comments')
export class CommentsController {
    constructor(
        private commentService: CommentService,
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @ApiOperation({ summary: 'if there is a token it will return the status' })
    @Get(':commentId')
    @UseGuards(JwtOptionalAuthGuard)
    async getById(
        @Param('commentId') commentId: string,
        @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
    ) {
        return this.queryBus.execute<GetCommentQuery, CommentViewDto>(
            new GetCommentQuery({ commentId, userId: user?.id }),
        );
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
    @Put(':commentId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateComment(
        @Param('commentId') commentId: string,
        @Body() body: UpdateCommentInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ) {
        return this.commentService.updateComment({
            commentId,
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
                commentId: new Types.ObjectId(id),
                userId: new Types.ObjectId(user.id),
            }),
        );
    }
}
