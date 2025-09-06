import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatusEnum } from '../const/LikeStatusEnum';
import { HydratedDocument, Model, Types } from 'mongoose';
import { CreateLikeCommentDomainDto } from '../dto/create-like-comment.domain.dto';

@Schema({ timestamps: true })
export class LikeComment {
    @Prop({ enum: LikeStatusEnum, required: true })
    status: LikeStatusEnum;
    @Prop({ type: Types.ObjectId, required: true })
    userId: Types.ObjectId;
    @Prop({ type: Types.ObjectId, required: true })
    commentId: Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;

    static createInstance(
        dto: CreateLikeCommentDomainDto,
    ): LikeCommentDocument {
        const like = new this();
        like.userId = dto.userId;
        like.commentId = dto.commentId;
        like.status = dto.status;

        return like as LikeCommentDocument;
    }
    updateLike(status: LikeStatusEnum) {
        this.status = status;
    }
}

export const LikeCommentSchema = SchemaFactory.createForClass(LikeComment);

LikeCommentSchema.loadClass(LikeComment);

export type LikeCommentDocument = HydratedDocument<LikeComment>;

export type LikeCommentModelType = Model<LikeCommentDocument> &
    typeof LikeComment;
