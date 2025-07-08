import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { ExtendedLike, ExtendedLikeSchema } from './extended-like.schema';
import { CreatePostDomainDto } from './dto/create-post.domain.dto';

@Schema({ timestamps: true })
export class Post {
    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, required: true })
    shortDescription: string;

    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: String, required: true })
    blogId: string;

    @Prop({ type: String, required: true })
    blogName: string;

    @Prop({ type: ExtendedLikeSchema, required: true })
    extendedLikesInfo: ExtendedLike;

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
    // updatePost(dto: UpdateBlogDto) {
    //     this.websiteUrl = dto.websiteUrl;
    //     this.name = dto.name;
    //     this.description = dto.description;
    // }
}
export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & typeof Post;
