import { Module } from '@nestjs/common';
import { Blog, BlogSchema } from './domain/blog.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsRepository } from './infastructure/blogs.repository';
import { BlogsService } from './application/blogs.service';
import { BlogsControllers } from './api/blogs.controllers';
import { BlogsQueryRepository } from './infastructure/query/blogs.query-repository';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    ],
    controllers: [BlogsControllers],
    providers: [BlogsService, BlogsRepository, BlogsQueryRepository],
})
export class BlogPlatformModule {}
