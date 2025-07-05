import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDomainDto } from './dto/create-blog.domain.dto';

@Schema({ timestamps: true })
export class Blog {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, required: true })
    websiteUrl: string;

    @Prop({ type: Boolean, required: true, default: true })
    isMembership: boolean;

    createdAt: Date;
    updatedAt: Date;

    @Prop({ type: Date, nullable: true, default: null })
    deletedAt: Date | null;

    static createInstance(dto: CreateBlogDomainDto): BlogDocument {
        const blog = new this();
        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;
        return blog as BlogDocument;
    }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

//регистрирует методы сущности в схеме
BlogSchema.loadClass(Blog);

//Типизация документа
export type BlogDocument = HydratedDocument<Blog>;

//Типизация модели + статические методы
export type BlogModelType = Model<BlogDocument> & typeof Blog;
