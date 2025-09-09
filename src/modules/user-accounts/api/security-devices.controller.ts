import { Controller, Get } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { ExtractRefreshTokenFromRequest } from '../guards/decorators/extract-refresh-token-from-request';
import { QueryBus } from '@nestjs/cqrs';
import { GetDevicesQuery } from '../application/queries/get-devices.query';
import { DeviceViewDto } from './view-dto/devices.view-dto';

@Controller('security')
export class SecurityDevicesController {
    constructor(private queryBus: QueryBus) {}
    @ApiCookieAuth()
    @Get('devices')
    async getDevices(
        @ExtractRefreshTokenFromRequest() refreshToken: string | undefined,
    ) {
        return this.queryBus.execute<GetDevicesQuery, DeviceViewDto[]>(
            new GetDevicesQuery(refreshToken),
        );
    }
}
