import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersExternalRepository } from '../../../../user-accounts/infastructure/external/users.external-repository';
import { InjectModel } from '@nestjs/mongoose';
import {
    Comment,
    CommentModelType,
} from '../../../domain/comment/comment.entity';
import { CommentsRepository } from '../../../infastructure/comments.repository';
import { PostsRepository } from '../../../infastructure/posts.repository';

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
        private postsRepository: PostsRepository,
    ) {}

    async execute({ dto }: CreateCommentCommand) {
        const user = await this.usersExternalRepository.findOrNotFoundFail(
            dto.userId,
        );
        const post = await this.postsRepository.findOrNotFoundFail(dto.postId);

        const comment = this.commentModel.createInstance({
            userId: user._id,
            content: dto.content,
            userLogin: user.login,
            postId: post._id,
        });

        await this.commentsRepository.save(comment);

        return comment.id.toString();
    }
}
