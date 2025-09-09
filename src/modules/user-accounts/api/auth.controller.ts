import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { ExtractUserFromRequest } from '../guards/decorators/extract-user-from-request.decorator';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCookieAuth,
    ApiResponse,
} from '@nestjs/swagger';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { Response } from 'express';
import {
    RegistrationConfirmationInputDto,
    RegistrationEmailResendingInputDto,
} from './input-dto/registration-confirmation.input-dto';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../application/use-cases/users/register-user.use-case';
import { LoginCommand } from '../application/use-cases/auth/login.use-case';
import { RegistrationConfirmationCommand } from '../application/use-cases/auth/registration-confirmation.use-case';
import { RegistrationEmailResendingCommand } from '../application/use-cases/auth/registration-email-resending.use-case';
import { PasswordRecoveryInputDto } from './input-dto/password-recovery.input-dto';
import { NewPasswordCommand } from '../application/use-cases/auth/new-password.use-case';
import { PasswordRecoveryCommand } from '../application/use-cases/auth/password-recovery.use-case';
import { NewPasswordInputDto } from './input-dto/new-password.input-dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { UsersQueryRepository } from '../infastructure/query/users.query-repository';
import { RefreshTokenCommand } from '../application/use-cases/auth/refresh-token.use-case';
import { ExtractClientDataFromRequest } from '../guards/decorators/extract-client-data-from-request';
import { ClientContextDto } from '../guards/dto/client-context.dto';
import { ExtractRefreshTokenFromRequest } from '../guards/decorators/extract-refresh-token-from-request';
import { LogoutCommand } from '../application/use-cases/auth/logout.use-case';

@Controller('auth')
export class AuthController {
    constructor(
        private commandBus: CommandBus,
        private usersQueryRepository: UsersQueryRepository,
    ) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                loginOrEmail: { type: 'string', example: 'string' },
                password: { type: 'string', example: 'admin123' },
            },
        },
    })
    @ApiResponse({
        schema: {
            type: 'object',
            properties: { accessToken: { type: 'string' } },
        },
    })
    async login(
        @ExtractUserFromRequest() user: UserContextDto,
        @ExtractClientDataFromRequest() client: ClientContextDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{ accessToken: string }> {
        const { accessToken, refreshToken } = await this.commandBus.execute<
            LoginCommand,
            { accessToken: string; refreshToken: string }
        >(
            new LoginCommand({
                userId: user.id,
                ip: client.ip,
                deviceName: client.userAgent,
            }),
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
        });

        return { accessToken };
    }

    @ApiResponse({
        schema: {
            type: 'object',
            properties: { accessToken: { type: 'string' } },
        },
    })
    @ApiCookieAuth()
    @Post('refresh-token')
    async refreshToken(
        @ExtractRefreshTokenFromRequest() refreshToken: string | undefined,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { newAccessToken, newRefreshToken } =
            await this.commandBus.execute<
                RefreshTokenCommand,
                { newAccessToken: string; newRefreshToken: string }
            >(new RefreshTokenCommand(refreshToken));

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
        });
        return { accessToken: newAccessToken };
    }

    @ApiCookieAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('logout')
    async logout(
        @Res({ passthrough: true }) res: Response,
        @ExtractRefreshTokenFromRequest() refreshToken: string | undefined,
    ) {
        await this.commandBus.execute<LogoutCommand, void>(
            new LogoutCommand(refreshToken),
        );
        res.clearCookie('refreshToken', { path: '/' });
        return;
    }

    @Post('registration')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registration(@Body() body: CreateUserInputDto) {
        return this.commandBus.execute<RegisterUserCommand, void>(
            new RegisterUserCommand(body),
        );
    }

    @Post('registration-confirmation')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registrationConfirmation(
        @Body() body: RegistrationConfirmationInputDto,
    ) {
        return this.commandBus.execute<RegistrationConfirmationCommand, void>(
            new RegistrationConfirmationCommand(body.code),
        );
    }

    @Post('registration-email-resending')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registrationEmailResending(
        @Body() body: RegistrationEmailResendingInputDto,
    ) {
        return this.commandBus.execute<RegistrationEmailResendingCommand, void>(
            new RegistrationEmailResendingCommand(body.email),
        );
    }

    @Post('password-recovery')
    @HttpCode(HttpStatus.NO_CONTENT)
    async passwordRecovery(@Body() body: PasswordRecoveryInputDto) {
        return this.commandBus.execute<PasswordRecoveryCommand, void>(
            new PasswordRecoveryCommand(body.email),
        );
    }

    @Post('new-password')
    @HttpCode(HttpStatus.NO_CONTENT)
    async newPassword(@Body() body: NewPasswordInputDto) {
        return this.commandBus.execute<NewPasswordCommand, void>(
            new NewPasswordCommand(body),
        );
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('me')
    async me(@ExtractUserFromRequest() user: UserContextDto) {
        return this.usersQueryRepository.getUserById(user.id);
    }
}
