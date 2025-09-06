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
import { LikeStatusCommentUseCase } from './application/use-cases/comments/like-status.use-case';
import {
    LikeComment,
    LikeCommentSchema,
} from './domain/comment/likes-comment.entity';
import { LikesCommentRepository } from './infastructure/likes-comment.repository';
import { GetCommentQueryHandler } from './application/queries/get-comment.query';
import { GetCommentsByPostIdQueryHandler } from './application/queries/get-comments-by-postId.query';
import { LikeStatusPostUseCase } from './application/use-cases/posts/like-status-post.use-case';
import { LikePost, LikePostSchema } from './domain/post/likes-post.entity';
import { LikesPostRepository } from './infastructure/likes-post.repository';
import { GetPostQueryHandler } from './application/queries/get-post.query';

const useCases = [
    CreateCommentUseCase,
    LikeStatusCommentUseCase,
    LikeStatusPostUseCase,
];
const queries = [
    GetCommentQueryHandler,
    GetCommentsByPostIdQueryHandler,
    GetPostQueryHandler,
];

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Blog.name, schema: BlogSchema },
            { name: Post.name, schema: PostSchema },
            { name: Comment.name, schema: CommentSchema },
            { name: LikeComment.name, schema: LikeCommentSchema },
            { name: LikePost.name, schema: LikePostSchema },
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
        LikesPostRepository,

        CommentService,
        CommentsRepository,
        CommentsQueryRepository,
        LikesCommentRepository,

        ...useCases,
        ...queries,
    ],
})
export class BlogPlatformModule {}
