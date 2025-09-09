import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModelType } from '../../../domain/session.entity';
import { v4 as uuid } from 'uuid';
import { Types } from 'mongoose';
import { SessionsRepository } from '../../../infastructure/sessions.repository';
import { RefreshTokenPayload } from './dto/refresh-token-payload.dto';
import * as process from 'node:process';

export class LoginCommand {
    constructor(
        public dto: { userId: string; deviceName: string; ip: string },
    ) {}
}

@CommandHandler(LoginCommand)
export class LoginUserUseCase implements ICommandHandler<LoginCommand> {
    constructor(
        private jwtService: JwtService,
        @InjectModel(Session.name) private sessionModel: SessionModelType,
        private sessionsRepository: SessionsRepository,
    ) {}

    async execute({ dto }: LoginCommand) {
        const accessToken = this.jwtService.sign({ id: dto.userId });
        const deviceId = uuid();

        const refreshToken = this.jwtService.sign(
            { id: dto.userId, deviceId },
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN },
        );

        const token = this.jwtService.decode<RefreshTokenPayload>(refreshToken);

        const session = this.sessionModel.createInstance({
            userId: new Types.ObjectId(dto.userId),
            exp: token.exp,
            iat: token.iat,
            deviceId: token.deviceId,
            deviceName: dto.deviceName,
            ip: dto.ip,
        });
        await this.sessionsRepository.save(session);
        return {
            accessToken,
            refreshToken,
        };
    }
}
