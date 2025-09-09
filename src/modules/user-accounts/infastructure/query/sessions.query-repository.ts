import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModelType } from '../../domain/session.entity';
import { FilterQuery, Types } from 'mongoose';
import { DeviceViewDto } from '../../api/view-dto/devices.view-dto';

@Injectable()
export class SessionsQueryRepository {
    constructor(
        @InjectModel(Session.name) private sessionModel: SessionModelType,
    ) {}
    async getDevices(userId: Types.ObjectId): Promise<DeviceViewDto[]> {
        const filter: FilterQuery<Session> = {
            userId,
        };

        const devices = await this.sessionModel.find(filter).exec();
        return devices.map(DeviceViewDto.mapToView);
    }
}
