import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePostInputDto } from './input-dto/posts.input-dto';
import { PostsService } from '../application/posts.service';
import { PostViewDto } from './view-dto/posts.view-dto';
import { PostsQueryRepository } from '../infastructure/query/posts.query-repository';
import { ApiParam } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private postsService: PostsService,
    ) {}

    @Post()
    async createPost(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
        const blogId = await this.postsService.createPost(body);
        return this.postsQueryRepository.getByIdOrNotFoundFail(blogId);
    }

    @ApiParam({ name: 'id' })
    @Get(':id')
    async getById(@Param('id') id: string): Promise<PostViewDto> {
        return this.postsQueryRepository.getByIdOrNotFoundFail(id);
    }
}
