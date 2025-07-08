import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../domain/post.enity';
import { PostsRepository } from '../infastructure/posts.repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { BlogsRepository } from '../infastructure/blogs.repository';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private PostModel: PostModelType,
        private postsRepository: PostsRepository,
        private blogsRepository: BlogsRepository,
    ) {}

    async createPost(dto: CreatePostDto) {
        const blog = await this.blogsRepository.findOrNotFoundFail(dto.blogId);

        const post = this.PostModel.createInstance({
            title: dto.title,
            content: dto.content,
            shortDescription: dto.shortDescription,
            blogId: blog.id,
            blogName: blog.name,
        });

        await this.postsRepository.save(post);
        return post._id.toString();
    }
    // async deleteBlog(id: string) {
    //     const blog = await this.blogsRepository.findOrNotFoundFail(id);
    //     blog.makeDeleted();
    //     await this.blogsRepository.save(blog);
    // }
    // async updateBlog(dto: UpdateBlogDto) {
    //     const blog = await this.blogsRepository.findOrNotFoundFail(dto.id);
    //     blog.updateBlog(dto);
    //     await this.blogsRepository.save(blog);
    // }
}
