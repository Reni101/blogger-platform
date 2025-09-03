import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentModelType } from '../../domain/comment/comment.entity';
import { CommentViewDto } from '../../api/view-dto/comments.view-dto';
import { Comment } from '../../domain/comment/comment.entity';

@Injectable()
export class CommentsQueryRepository {
    constructor(
        @InjectModel(Comment.name) private CommentModel: CommentModelType,
    ) {}

    async getByIdOrNotFoundFail(id: string): Promise<CommentViewDto> {
        const post = await this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        });

        if (!post) {
            throw new NotFoundException('comment not found');
        }

        return CommentViewDto.mapToView(post);
    }
}
