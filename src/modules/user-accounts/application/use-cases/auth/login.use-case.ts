import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

export class LoginCommand {
    constructor(
        public userId: string,
        public login: string,
    ) {}
}

@CommandHandler(LoginCommand)
export class LoginUserUseCase implements ICommandHandler<LoginCommand> {
    constructor(private jwtService: JwtService) {}

    async execute({ userId, login }: LoginCommand) {
        const accessToken = this.jwtService.sign({ id: userId, login });
        const refreshToken = this.jwtService.sign(
            { id: userId },
            { expiresIn: '20m' },
        );

        return {
            accessToken,
            refreshToken,
        };
    }
}
