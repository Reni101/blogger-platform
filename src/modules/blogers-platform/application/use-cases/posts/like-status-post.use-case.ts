import { CreateLikePostDomainDto } from '../../../domain/dto/create-like-post.domain.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../infastructure/posts.repository';
import { LikesPostRepository } from '../../../infastructure/likes-post.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
    LikePost,
    LikePostModelType,
} from '../../../domain/post/likes-post.entity';
import { LikeStatusEnum } from '../../../domain/const/LikeStatusEnum';

export class LikeStatusPostCommand {
    constructor(public dto: CreateLikePostDomainDto) {}
}

@CommandHandler(LikeStatusPostCommand)
export class LikeStatusPostUseCase
    implements ICommandHandler<LikeStatusPostCommand>
{
    constructor(
        private postsRepository: PostsRepository,
        private likesPostRepository: LikesPostRepository,
        @InjectModel(LikePost.name)
        private likePostModelType: LikePostModelType,
    ) {}
    async execute({ dto }: LikeStatusPostCommand) {
        const { postId, status, userId } = dto;
        const post = await this.postsRepository.findOrNotFoundFail(
            dto.postId.toString(),
        );
        const like = await this.likesPostRepository.findByPostIdAndUserId({
            postId,
            userId,
        });

        if (!like) {
            const like = this.likePostModelType.createInstance(dto);
            await this.likesPostRepository.save(like);
            post.incrementLikeCount(status, 1);
            await this.postsRepository.save(post);
            return;
        }
        if (like && status === LikeStatusEnum.None) {
            post.incrementLikeCount(like.status, -1);
            await this.postsRepository.save(post);
            await like.deleteOne();
            return;
        }
        if (like.status !== dto.status) {
            like.updateLike(status);
            await this.likesPostRepository.save(like);
            post.toggleCount(status);
            await this.postsRepository.save(post);
            return;
        }

        return;
    }
}
