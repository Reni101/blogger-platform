import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { BlogsRepository } from '../infastructure/blogs.repository';

@Injectable()
export class BlogsService {
    constructor(
        @InjectModel(Blog.name) private BlogModel: BlogModelType,
        private blogsRepository: BlogsRepository,
    ) {}

    async createBlog(dto: CreateBlogDto) {
        const blog = this.BlogModel.createInstance({
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
        });

        await this.blogsRepository.save(blog);
        return blog._id.toString();
    }
}
