import { User, UserDocument, UserModelType } from '../../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';

@Injectable()
export class UsersExternalRepository {
    constructor(
        @InjectModel(User.name)
        private UserModel: UserModelType,
    ) {}

    async findById(id: string): Promise<UserDocument | null> {
        return this.UserModel.findOne({ _id: id, deletedAt: null });
    }

    async findOrNotFoundFail(id: string): Promise<UserDocument> {
        const user = await this.findById(id);

        if (!user) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'users not found',
            });
        }

        return user;
    }
}
