import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    Session,
    SessionDocument,
    SessionModelType,
} from '../domain/session.entity';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { Types } from 'mongoose';

@Injectable()
export class SessionsRepository {
    constructor(
        @InjectModel(Session.name) private sessionModel: SessionModelType,
    ) {}

    async findByIatAndDeviceId(iat: number, deviceId: string) {
        return this.sessionModel.findOne({ iat, deviceId });
    }

    async save(session: SessionDocument) {
        await session.save();
    }

    async findOrNotFoundFail(dto: { iat: number; deviceId: string }) {
        const session = await this.findByIatAndDeviceId(dto.iat, dto.deviceId);

        if (!session) {
            throw new DomainException({
                code: DomainExceptionCode.Unauthorized,
                message: 'session not found',
            });
        }

        return session;
    }
    async findByDeviceIdOrFail(deviceId: string) {
        const session = await this.sessionModel.findOne({ deviceId });
        if (!session) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'session not found',
            });
        }
        return session;
    }
    async getSessionsByUserId(userId: Types.ObjectId) {
        return this.sessionModel.find({ userId }).lean();
    }
    async deleteOtherSession(ids: Types.ObjectId[]) {
        return this.sessionModel.deleteMany({ _id: { $in: ids } });
    }
}
