import { Controller, Get } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';

@Controller('security')
export class SecurityDevicesController {
    @ApiCookieAuth()
    @Get('devices')
    async getDevices() {}
}
