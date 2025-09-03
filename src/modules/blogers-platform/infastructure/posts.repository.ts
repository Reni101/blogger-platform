import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../domain/post/post.enity';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class PostsRepository {
    constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

    async findById(id: string): Promise<PostDocument | null> {
        return this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async save(post: PostDocument) {
        await post.save();
    }

    async findOrNotFoundFail(id: string): Promise<PostDocument> {
        const post = await this.findById(id);

        if (!post) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'post not found',
            });
        }

        return post;
    }
}
