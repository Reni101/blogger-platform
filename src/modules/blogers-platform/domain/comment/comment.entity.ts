import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { Commentator, CommentatorSchema } from './commentator.schema';
import { LikesInfo, LikesInfoSchema } from './likes-Info.schema';
import { CreateCommentDomainDto } from '../dto/create-comment.domain.dto';
import { CreateCommentDto } from '../../dto/comments/create-comment.dto';
import { LikeStatusEnum } from '../const/LikeStatusEnum';

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

    @Prop({ type: Types.ObjectId, required: true })
    postId: Types.ObjectId;

    @Prop({ type: CommentatorSchema, required: true })
    commentatorInfo: Commentator;

    @Prop({ type: LikesInfoSchema, required: true })
    likesInfo: LikesInfo;

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
        comment.postId = dto.postId;

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
    incrementLikeCount(status: LikeStatusEnum, value: number) {
        if (status == LikeStatusEnum.Like) {
            this.likesInfo.likesCount = this.likesInfo.likesCount + value;
        } else
            this.likesInfo.dislikesCount = this.likesInfo.dislikesCount + value;
    }
    toggleCount(status: LikeStatusEnum) {
        if (status == LikeStatusEnum.Like) {
            this.likesInfo.likesCount++;
            this.likesInfo.dislikesCount--;
        } else {
            this.likesInfo.likesCount--;
            this.likesInfo.dislikesCount++;
        }
    }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument> & typeof Comment;
