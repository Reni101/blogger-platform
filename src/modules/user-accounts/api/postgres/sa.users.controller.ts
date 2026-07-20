import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { BasicAuthGuard } from '../../guards/basic/bacis-auth.guard';
import { CreateUserInputDto } from '../input-dto/users.input-dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserPostgresCommand } from '../../application/use-cases/admins/postgres/create-user-postgres.use-case';

@Controller('sa/users')
@ApiSecurity('basic')
@UseGuards(BasicAuthGuard)
export class SaUsersController {
    constructor(private commandBus: CommandBus) {}
    @Post()
    async createUser(@Body() body: CreateUserInputDto) {
        const userId = await this.commandBus.execute<
            CreateUserPostgresCommand,
            number
        >(new CreateUserPostgresCommand(body));
        debugger;
        // const userId = await this.commandBus.execute<CreateUserCommand, string>(
        //     new CreateUserCommand(body),
        // );
        // return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
    }
}
