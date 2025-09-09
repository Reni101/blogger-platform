import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SessionsService } from '../sessions.service';
import { DeviceViewDto } from '../../api/view-dto/devices.view-dto';
import { SessionsQueryRepository } from '../../infastructure/query/sessions.query-repository';

export class GetDevicesQuery {
    constructor(public refreshToken?: string) {}
}

@QueryHandler(GetDevicesQuery)
export class GetDevicesQueryHandler implements IQueryHandler<GetDevicesQuery> {
    constructor(
        private sessionsService: SessionsService,
        private sessionsQueryRepository: SessionsQueryRepository,
    ) {}

    async execute({ refreshToken }: GetDevicesQuery): Promise<DeviceViewDto[]> {
        const session =
            await this.sessionsService.checkRefreshToken(refreshToken);

        return this.sessionsQueryRepository.getDevices(session.userId);
    }
}
