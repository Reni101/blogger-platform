import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { ExtendedLikesInfo, ExtendLikesSchema } from './extend-likes.schema';
import { CreatePostDomainDto } from '../dto/create-post.domain.dto';
import { UpdatePostDto } from '../../dto/posts/update-post.dto';

export const titleConstraints = {
    minLength: 1,
    maxLength: 30,
};

export const shortDescriptionConstraints = {
    minLength: 1,
    maxLength: 100,
};
export const contentDescriptionConstraints = {
    minLength: 1,
    maxLength: 1000,
};

@Schema({ timestamps: true })
export class Post {
    @Prop({
        type: String,
        required: true,
        min: titleConstraints.minLength,
        max: titleConstraints.maxLength,
    })
    title: string;

    @Prop({
        type: String,
        required: true,
        min: shortDescriptionConstraints.minLength,
        max: shortDescriptionConstraints.maxLength,
    })
    shortDescription: string;

    @Prop({
        type: String,
        required: true,
        min: contentDescriptionConstraints.minLength,
        max: contentDescriptionConstraints.maxLength,
    })
    content: string;

    @Prop({ type: String, required: true })
    blogId: string;

    @Prop({ type: String, required: true })
    blogName: string;

    @Prop({ type: ExtendLikesSchema, required: true })
    extendedLikesInfo: ExtendedLikesInfo;

    createdAt: Date;
    updatedAt: Date;

    @Prop({ type: Date, nullable: true, default: null })
    deletedAt: Date | null;

    static createInstance(dto: CreatePostDomainDto): PostDocument {
        const post = new this();
        post.title = dto.title;
        post.content = dto.content;
        post.shortDescription = dto.shortDescription;
        post.blogId = dto.blogId;
        post.blogName = dto.blogName;
        post.extendedLikesInfo = {
            dislikesCount: 0,
            likesCount: 0,
        };
        return post as PostDocument;
    }

    makeDeleted() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date();
    }
    updatePost(dto: UpdatePostDto & { blogName: string }) {
        this.title = dto.title;
        this.shortDescription = dto.shortDescription;
        this.content = dto.content;
        this.blogName = dto.blogName;
        this.blogId = dto.blogId;
    }
}
export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & typeof Post;
