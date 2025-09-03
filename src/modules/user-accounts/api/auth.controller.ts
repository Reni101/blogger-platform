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
import { AuthService } from '../application/auth.service';
import { ExtractUserFromRequest } from '../guards/decorators/param/extract-user-from-request.decorator';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
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

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
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
    async login(
        @ExtractUserFromRequest() user: UserContextDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{ accessToken: string }> {
        const { accessToken, refreshToken } = await this.commandBus.execute<
            LoginCommand,
            { accessToken: string; refreshToken: string }
        >(new LoginCommand(user.id));

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
