import { Module } from '@nestjs/common';
import { Blog, BlogSchema } from './domain/blog.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsRepository } from './infastructure/blogs.repository';
import { BlogsService } from './application/blogs.service';
import { BlogsControllers } from './api/blogs.controllers';
import { BlogsQueryRepository } from './infastructure/query/blogs.query-repository';
import { PostsController } from './api/posts.controller';
import { Post, PostSchema } from './domain/post/post.enity';
import { PostsRepository } from './infastructure/posts.repository';
import { PostsService } from './application/posts.service';
import { PostsQueryRepository } from './infastructure/query/posts.query-repository';
import { Comment, CommentSchema } from './domain/comment/comment.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Blog.name, schema: BlogSchema },
            { name: Post.name, schema: PostSchema },
            { name: Comment.name, schema: CommentSchema },
        ]),
    ],
    controllers: [BlogsControllers, PostsController],
    providers: [
        BlogsService,
        BlogsRepository,
        BlogsQueryRepository,
        //P
        PostsService,
        PostsRepository,
        PostsQueryRepository,
    ],
})
export class BlogPlatformModule {}
