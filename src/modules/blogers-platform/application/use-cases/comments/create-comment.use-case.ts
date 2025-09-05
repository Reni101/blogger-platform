import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersExternalRepository } from '../../../../user-accounts/infastructure/external/users.external-repository';
import { InjectModel } from '@nestjs/mongoose';
import {
    Comment,
    CommentModelType,
} from '../../../domain/comment/comment.entity';
import { CommentsRepository } from '../../../infastructure/comments.repository';
import { Types } from 'mongoose';

class CreateCommentDto {
    postId: string;
    content: string;
    userId: string;
}

export class CreateCommentCommand {
    constructor(public dto: CreateCommentDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
    implements ICommandHandler<CreateCommentCommand>
{
    constructor(
        private usersExternalRepository: UsersExternalRepository,
        @InjectModel(Comment.name)
        private commentModel: CommentModelType,
        private commentsRepository: CommentsRepository,
    ) {}

    async execute({ dto }: CreateCommentCommand) {
        const user = await this.usersExternalRepository.findOrNotFoundFail(
            dto.userId,
        );

        const comment = this.commentModel.createInstance({
            userId: user._id,
            content: dto.content,
            userLogin: user.login,
            postId: new Types.ObjectId(dto.userId),
        });

        await this.commentsRepository.save(comment);

        return comment.id.toString();
    }
}
