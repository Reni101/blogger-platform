import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsService } from '../../sessions.service';
import { SessionsRepository } from '../../../infastructure/sessions.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';

export class TerminateDeviceCommand {
    constructor(public dto: { refreshToken?: string; deviceId: string }) {}
}
@CommandHandler(TerminateDeviceCommand)
export class TerminateDeviceUseCase
    implements ICommandHandler<TerminateDeviceCommand>
{
    constructor(
        private sessionsService: SessionsService,
        private sessionsRepository: SessionsRepository,
    ) {}
    async execute({ dto }: TerminateDeviceCommand) {
        const session = await this.sessionsService.checkRefreshToken(
            dto.refreshToken,
        );
        const sessionForDelete =
            await this.sessionsRepository.findByDeviceIdOrFail(dto.deviceId);

        if (sessionForDelete.userId.toString() !== session.userId.toString()) {
            throw new DomainException({
                message: 'forbiden delete the session',
                code: DomainExceptionCode.Forbidden,
            });
        }
        await sessionForDelete.deleteOne();
    }
}
