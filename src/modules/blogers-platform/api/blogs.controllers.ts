import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { BlogViewDto } from './view-dto/blogs.view-dto';
import { BlogsQueryRepository } from '../infastructure/query/blogs.query-repository';
import { CreateBlogInputDto } from './input-dto/blogs.input-dto';
import { BlogsService } from '../application/blogs.service';

@Controller('blogs')
export class BlogsControllers {
    constructor(
        private blogsQueryRepository: BlogsQueryRepository,
        private blogsService: BlogsService,
    ) {}

    @ApiParam({ name: 'id' })
    @Get(':id')
    async getById(@Param('id') id: string): Promise<BlogViewDto> {
        return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
    }

    @Post()
    async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
        const blogId = await this.blogsService.createBlog(body);
        return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
    }

    @ApiParam({ name: 'id' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlogr(@Param('id') id: string): Promise<void> {
        return this.blogsService.deleteBlog(id);
    }
}
