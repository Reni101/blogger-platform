import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Commentator, CommentatorSchema } from './commentator.schema';
import { CommentLike, CommentLikeSchema } from './comment-like.schema';
import { CreateCommentDomainDto } from '../dto/create-comment.domain.dto';
import { CreateCommentDto } from '../../dto/comments/create-comment.dto';

export const contentConstraints = {
    minLength: 20,
    maxLength: 300,
};

@Schema({ timestamps: true })
export class Comment {
    @Prop({
        type: String,
        required: true,
        min: contentConstraints.minLength,
        max: contentConstraints.maxLength,
    })
    content: string;

    @Prop({ type: CommentatorSchema, required: true })
    commentatorInfo: Commentator;

    @Prop({ type: CommentLikeSchema, required: true })
    likesInfo: CommentLike;

    createdAt: Date;
    updatedAt: Date;

    @Prop({ type: Date, nullable: true, default: null })
    deletedAt: Date | null;

    static createInstance(dto: CreateCommentDomainDto): CommentDocument {
        const comment = new this();
        comment.content = dto.content;
        comment.commentatorInfo = {
            userId: dto.userId,
            userLogin: dto.userLogin,
        };

        comment.likesInfo = {
            dislikesCount: 0,
            likesCount: 0,
        };
        return comment as CommentDocument;
    }

    makeDeleted() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date();
    }
    updateComment(dto: CreateCommentDto) {
        this.content = dto.content;
    }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument> & typeof Comment;
