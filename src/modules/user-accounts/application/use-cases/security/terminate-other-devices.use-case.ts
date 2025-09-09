import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsService } from '../../sessions.service';
import { SessionsRepository } from '../../../infastructure/sessions.repository';

export class TerminateOtherDevicesCommand {
    constructor(public refreshToken?: string) {}
}
@CommandHandler(TerminateOtherDevicesCommand)
export class TerminateOtherDevicesUseCase
    implements ICommandHandler<TerminateOtherDevicesCommand>
{
    constructor(
        private sessionsService: SessionsService,
        private sessionsRepository: SessionsRepository,
    ) {}
    async execute({ refreshToken }: TerminateOtherDevicesCommand) {
        const session =
            await this.sessionsService.checkRefreshToken(refreshToken);

        const sessions = await this.sessionsRepository.getSessionsByUserId(
            session.userId,
        );

        const sessionForDelete = sessions
            .filter((el) => el.deviceId !== session.deviceId)
            .map((el) => el._id);
        await this.sessionsRepository.deleteOtherSession(sessionForDelete);
        return;
    }
}
