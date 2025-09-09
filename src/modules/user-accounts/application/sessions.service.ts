import { Injectable } from '@nestjs/common';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { RefreshTokenPayload } from './use-cases/auth/dto/refresh-token-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { SessionsRepository } from '../infastructure/sessions.repository';

@Injectable()
export class SessionsService {
    constructor(
        private jwtService: JwtService,
        private sessionsRepository: SessionsRepository,
    ) {}

    async checkRefreshToken(refreshToken: string | undefined) {
        if (!refreshToken) {
            throw new DomainException({
                message: 'no refresh token',
                code: DomainExceptionCode.Unauthorized,
            });
        }

        const token = this.jwtService.decode<RefreshTokenPayload>(refreshToken);

        const session = await this.sessionsRepository.findOrNotFoundFail({
            iat: token.iat,
            deviceId: token.deviceId,
        });
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime > session.exp) {
            await session.deleteOne();
            throw new DomainException({
                message: 'refresh token is expired',
                code: DomainExceptionCode.Unauthorized,
            });
        }
        return session;
    }
}
