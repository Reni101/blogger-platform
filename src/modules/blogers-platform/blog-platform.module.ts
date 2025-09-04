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
import { CommentsController } from './api/comments.controller';
import { CommentsQueryRepository } from './infastructure/query/comments.query-repository';
import { CommentService } from './application/comment.service';
import { CommentsRepository } from './infastructure/comments.repository';
import { CreateCommentUseCase } from './application/use-cases/comments/create-comment.use-case';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';

const useCases = [CreateCommentUseCase];

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Blog.name, schema: BlogSchema },
            { name: Post.name, schema: PostSchema },
            { name: Comment.name, schema: CommentSchema },
        ]),
        UserAccountsModule,
    ],
    controllers: [BlogsControllers, PostsController, CommentsController],
    providers: [
        BlogsService,
        BlogsRepository,
        BlogsQueryRepository,

        PostsService,
        PostsRepository,
        PostsQueryRepository,

        CommentService,
        CommentsRepository,
        CommentsQueryRepository,
        ...useCases,
    ],
})
export class BlogPlatformModule {}
