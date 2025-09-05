import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Comment, CommentModelType } from '../../domain/comment/comment.entity';
import { CommentViewDto } from '../../api/view-dto/comments.view-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { FilterQuery, Types } from 'mongoose';
import { GetCommentsQueryParams } from '../../api/input-dto/get-comments-query-params.input-dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';

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
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'comment not found',
            });
        }

        return CommentViewDto.mapToView(comment);
    }

    async getAll(
        query: GetCommentsQueryParams,
        postId?: string,
    ): Promise<PaginatedViewDto<CommentViewDto[]>> {
        const filter: FilterQuery<Comment> = {
            deletedAt: null,
        };
        if (postId) {
            filter.postId = new Types.ObjectId(postId);
        }

        const users = await this.CommentModel.find(filter)
            .sort({ [query.sortBy]: query.sortDirection })
            .skip(query.calculateSkip())
            .limit(query.pageSize)
            .lean();

        const totalCount = await this.CommentModel.countDocuments(filter);

        const items = users.map(CommentViewDto.mapToView);

        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: query.pageNumber,
            size: query.pageSize,
        });
    }
}
