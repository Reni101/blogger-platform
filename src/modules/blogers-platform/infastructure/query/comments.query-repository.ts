import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment, CommentModelType } from '../../domain/comment/comment.entity';
import { CommentViewDto } from '../../api/view-dto/comments.view-dto';

@Injectable()
export class CommentsQueryRepository {
    constructor(
        @InjectModel(Comment.name) private CommentModel: CommentModelType,
    ) {}

    async getByIdOrNotFoundFail(id: string): Promise<CommentViewDto> {
        const comment = await this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        });

        if (!comment) {
            throw new NotFoundException('comment not found');
        }

        return CommentViewDto.mapToView(comment);
    }
}
