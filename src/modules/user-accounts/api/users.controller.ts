import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input-dto';
import { UsersQueryRepository } from '../infastructure/query/users.query-repository';
import { UserViewDto } from './view-dto/users.view-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { UsersService } from '../application/users.service';

@Controller('users')
export class UsersController {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersService: UsersService,
    ) {
        //
        // private usersService: UsersService,
    }

    @Get()
    async getAll(
        @Query() query: GetUsersQueryParams,
    ): Promise<PaginatedViewDto<UserViewDto[]>> {
        return this.usersQueryRepository.getAll(query);
    }
    @Post()
    async createUser(@Body() body: CreateUserInputDto) {
        const userId = await this.usersService.createUser(body);
        return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
    }
}
