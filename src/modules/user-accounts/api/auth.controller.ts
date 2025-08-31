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
import {
    RegistrationConfirmationInputDto,
    RegistrationEmailResendingInputDto,
} from './input-dto/registration-confirmation.input-dto';
import { RegisterUserUseCase } from '../application/use-cases/users/register-user.use-case';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private registerUserUseCase: RegisterUserUseCase,
    ) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                loginOrEmail: { type: 'string', example: 'maxim1' },
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

        return { accessToken };
    }

    @Post('registration')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registration(@Body() body: CreateUserInputDto) {
        await this.registerUserUseCase.execute(body);
        return;
    }

    @Post('registration-confirmation')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registrationConfirmation(
        @Body() body: RegistrationConfirmationInputDto,
    ) {
        await this.authService.registrationConfirmation(body.code);
        return;
    }

    @Post('registration-email-resending')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registrationEmailResending(
        @Body() body: RegistrationEmailResendingInputDto,
    ) {
        await this.authService.registrationEmailResending(body.email);
        return;
    }
}
