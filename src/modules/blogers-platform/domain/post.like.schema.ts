import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatusEnum } from './const/LikeStatusEnum';

@Schema({
    _id: false,
    timestamps: true,
})
export class Like {
    @Prop({ type: String, required: true })
    status: LikeStatusEnum;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, required: true })
    login: string;

    @Prop({ type: String, required: true })
    postId: string;

    createdAt: Date;
    updatedAt: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
