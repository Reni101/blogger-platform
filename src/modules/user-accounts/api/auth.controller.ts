import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { AuthService } from '../application/auth.service';
import { ExtractUserFromRequest } from '../guards/decorators/param/extract-user-from-request.decorator';
import { ApiBody } from '@nestjs/swagger';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { Response } from 'express';
import { UsersService } from '../application/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                login: { type: 'string', example: 'maxim' },
                password: { type: 'string', example: 'maxim1' },
            },
        },
    })
    async login(
        @ExtractUserFromRequest() user: UserContextDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{ accessToken: string }> {
        const { accessToken, refreshToken } = await this.authService.login(
            user.id,
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 1200000,
        });
        debugger;
        return { accessToken };
    }

    @Post('registration')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registration(@Body() body: CreateUserInputDto) {
        await this.usersService.registerUser(body);
        return;
    }
}
