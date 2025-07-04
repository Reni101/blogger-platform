import { Controller, Get, Query } from '@nestjs/common';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input-dto';

@Controller('users')
export class UsersController {
    @Get()
    getAll(@Query() query: GetUsersQueryParams): any {
        return {};
    }
}
// Promise<UserViewDto>
