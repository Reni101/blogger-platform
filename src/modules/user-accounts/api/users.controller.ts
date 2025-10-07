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
import { UsersViewDto } from './view-dto/users.view-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { ApiParam, ApiSecurity } from '@nestjs/swagger';
import { BasicAuthGuard } from '../guards/basic/bacis-auth.guard';
import { CreateUserCommand } from '../application/use-cases/admins/create-user.use-case';
import { DeleteUserCommand } from '../application/use-cases/admins/delete-user.use-case';
import { CommandBus } from '@nestjs/cqrs';

//    @InjectDataSource() protected dataSource: DataSource
//     const res = await this.dataSource.query('SELECT * FROM "Users"');

@Controller('users')
@ApiSecurity('basic')
@UseGuards(BasicAuthGuard)
export class UsersController {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private commandBus: CommandBus,
    ) {}

    @Get()
    async getAll(
        @Query() query: GetUsersQueryParams,
    ): Promise<PaginatedViewDto<UsersViewDto[]>> {
        return this.usersQueryRepository.getAll(query);
    }
    @Post()
    async createUser(@Body() body: CreateUserInputDto): Promise<UsersViewDto> {
        const userId = await this.commandBus.execute<CreateUserCommand, string>(
            new CreateUserCommand(body),
        );
        return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
    }
    @ApiParam({ name: 'id' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('id') id: string): Promise<void> {
        return this.commandBus.execute<DeleteUserCommand, void>(
            new DeleteUserCommand(id),
        );
    }
}
