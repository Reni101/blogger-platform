import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
} from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { ExtractRefreshTokenFromRequest } from '../guards/decorators/extract-refresh-token-from-request';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetDevicesQuery } from '../application/queries/get-devices.query';
import { DeviceViewDto } from './view-dto/devices.view-dto';
import { TerminateOtherDevicesCommand } from '../application/use-cases/security/terminate-other-devices.use-case';
import { TerminateDeviceCommand } from '../application/use-cases/security/terminate-device.use-case';

@Controller('security')
export class SecurityDevicesController {
    constructor(
        private queryBus: QueryBus,
        private commandBus: CommandBus,
    ) {}

    @ApiCookieAuth()
    @Get('devices')
    async getDevices(
        @ExtractRefreshTokenFromRequest() refreshToken: string | undefined,
    ) {
        return this.queryBus.execute<GetDevicesQuery, DeviceViewDto[]>(
            new GetDevicesQuery(refreshToken),
        );
    }

    @ApiCookieAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('devices')
    terminateDevices(
        @ExtractRefreshTokenFromRequest() refreshToken: string | undefined,
    ) {
        return this.commandBus.execute<TerminateOtherDevicesCommand, void>(
            new TerminateOtherDevicesCommand(refreshToken),
        );
    }

    @ApiCookieAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('devices/:deviceId')
    terminateDevice(
        @ExtractRefreshTokenFromRequest() refreshToken: string | undefined,
        @Param('deviceId') deviceId: string,
    ) {
        return this.commandBus.execute<TerminateDeviceCommand, void>(
            new TerminateDeviceCommand({ refreshToken, deviceId }),
        );
    }
}
