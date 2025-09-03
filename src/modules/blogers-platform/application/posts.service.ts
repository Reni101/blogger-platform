import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../domain/post/post.enity';
import { PostsRepository } from '../infastructure/posts.repository';
import { CreatePostDto } from '../dto/posts/create-post.dto';
import { BlogsRepository } from '../infastructure/blogs.repository';
import { UpdatePostDto } from '../dto/posts/update-post.dto';

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
    async deletePost(id: string) {
        const post = await this.postsRepository.findOrNotFoundFail(id);
        post.makeDeleted();
        await this.postsRepository.save(post);
    }
    async updatePost(dto: UpdatePostDto) {
        const blog = await this.blogsRepository.findOrNotFoundFail(dto.blogId);
        const post = await this.postsRepository.findOrNotFoundFail(dto.id);
        post.updatePost({ ...dto, blogName: blog.name });
        await this.postsRepository.save(post);
    }
}
