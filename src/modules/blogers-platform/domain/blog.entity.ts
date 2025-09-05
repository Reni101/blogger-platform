import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDomainDto } from './dto/create-blog.domain.dto';
import { UpdateBlogDto } from '../dto/blogs/update-blog.dto';

export const nameConstraints = {
    minLength: 1,
    maxLength: 15,
};
export const descriptionConstraints = {
    minLength: 1,
    maxLength: 300,
};

@Schema({ timestamps: true })
export class Blog {
    @Prop({
        type: String,
        required: true,
        max: nameConstraints.maxLength,
        min: nameConstraints.minLength,
    })
    name: string;

    @Prop({
        type: String,
        required: true,
        max: descriptionConstraints.maxLength,
        min: descriptionConstraints.minLength,
    })
    description: string;

    @Prop({ type: String, required: true })
    websiteUrl: string;

    @Prop({ type: Boolean, required: true, default: false })
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

    makeDeleted() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date();
    }
    updateBlog(dto: UpdateBlogDto) {
        this.websiteUrl = dto.websiteUrl;
        this.name = dto.name;
        this.description = dto.description;
    }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

//регистрирует методы сущности в схеме
BlogSchema.loadClass(Blog);

//Типизация документа
export type BlogDocument = HydratedDocument<Blog>;

//Типизация модели + статические методы
export type BlogModelType = Model<BlogDocument> & typeof Blog;
