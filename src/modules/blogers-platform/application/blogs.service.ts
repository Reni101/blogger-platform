import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from '../dto/blogs/create-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { BlogsRepository } from '../infastructure/blogs.repository';
import { UpdateBlogDto } from '../dto/blogs/update-blog.dto';

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
    async deleteBlog(id: string) {
        const blog = await this.blogsRepository.findOrNotFoundFail(id);
        blog.makeDeleted();
        await this.blogsRepository.save(blog);
    }
    async updateBlog(dto: UpdateBlogDto) {
        const blog = await this.blogsRepository.findOrNotFoundFail(dto.id);
        blog.updateBlog(dto);
        await this.blogsRepository.save(blog);
    }
}
