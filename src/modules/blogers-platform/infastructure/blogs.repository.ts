import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';

@Injectable()
export class BlogsRepository {
    constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

    async findById(id: string): Promise<BlogDocument | null> {
        return this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async save(user: BlogDocument) {
        await user.save();
    }

    async findOrNotFoundFail(id: string): Promise<BlogDocument> {
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundException('user not found');
        }

        return user;
    }
}
