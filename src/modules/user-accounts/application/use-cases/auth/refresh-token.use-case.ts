import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsService } from '../../sessions.service';
import { JwtService } from '@nestjs/jwt';
import { SessionsRepository } from '../../../infastructure/sessions.repository';
import { RefreshTokenPayload } from './dto/refresh-token-payload.dto';
import * as process from 'node:process';

export class RefreshTokenCommand {
    constructor(public refreshToken?: string) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase
    implements ICommandHandler<RefreshTokenCommand>
{
    constructor(
        private sessionsService: SessionsService,
        private sessionsRepository: SessionsRepository,
        private jwtService: JwtService,
    ) {}
    async execute({ refreshToken }: RefreshTokenCommand) {
        const session =
            await this.sessionsService.checkRefreshToken(refreshToken);
        const newAccessToken = this.jwtService.sign({
            id: session.userId.toString(),
        });

        const newRefreshToken = this.jwtService.sign(
            { id: session.userId.toString(), deviceId: session.deviceId },
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN },
        );

        const token =
            this.jwtService.decode<RefreshTokenPayload>(newRefreshToken);

        session.updateSession({ iat: token.iat, exp: token.exp });

        await this.sessionsRepository.save(session);
        return { newAccessToken, newRefreshToken };
    }
}
