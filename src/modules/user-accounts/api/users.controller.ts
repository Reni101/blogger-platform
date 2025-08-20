import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input-dto';
import { UsersQueryRepository } from '../infastructure/query/users.query-repository';
import { UserViewDto } from './view-dto/users.view-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { UsersService } from '../application/users.service';
import { ApiParam, ApiSecurity } from '@nestjs/swagger';
import { BasicAuthGuard } from '../guards/basic/bacis-auth.guard';

@Controller('users')
@ApiSecurity('basic')
@UseGuards(BasicAuthGuard)
export class UsersController {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersService: UsersService,
    ) {}

    @Get()
    async getAll(
        @Query() query: GetUsersQueryParams,
    ): Promise<PaginatedViewDto<UserViewDto[]>> {
        return this.usersQueryRepository.getAll(query);
    }
    @Post()
    async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
        const userId = await this.usersService.createUser(body);
        return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
    }
    @ApiParam({ name: 'id' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('id') id: string): Promise<void> {
        return this.usersService.deleteUser(id);
    }
}
