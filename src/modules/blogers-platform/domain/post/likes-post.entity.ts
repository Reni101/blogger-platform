import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatusEnum } from '../const/LikeStatusEnum';
import { HydratedDocument, Model, Types } from 'mongoose';
import { CreateLikePostDomainDto } from '../dto/create-like-post.domain.dto';

@Schema({ timestamps: true })
export class LikePost {
    @Prop({ enum: LikeStatusEnum, required: true })
    status: LikeStatusEnum;
    @Prop({ type: Types.ObjectId, required: true })
    userId: Types.ObjectId;
    @Prop({ type: Types.ObjectId, required: true })
    postId: Types.ObjectId;

    @Prop({ type: String, required: true })
    login: string;

    createdAt: Date;
    updatedAt: Date;

    static createInstance(dto: CreateLikePostDomainDto): LikePostDocument {
        const like = new this();
        like.userId = dto.userId;
        like.postId = dto.postId;
        like.status = dto.status;
        like.login = dto.login;
        return like as LikePostDocument;
    }
    updateLike(status: LikeStatusEnum) {
        this.status = status;
    }
}

export const LikePostSchema = SchemaFactory.createForClass(LikePost);

LikePostSchema.loadClass(LikePost);

export type LikePostDocument = HydratedDocument<LikePost>;

export type LikePostModelType = Model<LikePostDocument> & typeof LikePost;
