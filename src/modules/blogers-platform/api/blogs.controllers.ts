import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { BlogViewDto } from './view-dto/blogs.view-dto';
import { BlogsQueryRepository } from '../infastructure/query/blogs.query-repository';

@Controller('blogs')
export class BlogsControllers {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}
    @ApiParam({ name: 'id' })
    @Get(':id')
    async getById(@Param('id') id: string): Promise<BlogViewDto> {
        return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
    }
}
