import { Types } from 'mongoose';

export class CreateSessionDomainDto {
    deviceName: string;
    userId: Types.ObjectId;
    ip: string;
    exp: number;
    iat: number;
    deviceId: string;
}
