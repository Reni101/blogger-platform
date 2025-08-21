import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

    async findById(id: string): Promise<UserDocument | null> {
        return this.UserModel.findOne({ _id: id, deletedAt: null });
    }

    async findByLoginOrEmail(
        loginOrEmail: string,
    ): Promise<UserDocument | null> {
        return this.UserModel.findOne({
            $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
            deletedAt: null,
        });
    }

    async save(user: UserDocument) {
        await user.save();
    }

    async findOrNotFoundFail(id: string): Promise<UserDocument> {
        const user = await this.findById(id);

        if (!user) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'user not found',
            });
        }

        return user;
    }

    async findUniqueUser(login: string, email: string) {
        return this.UserModel.findOne({ $or: [{ login }, { email }] });
    }

    async findByCodeOrNotFoundFail(code: string): Promise<UserDocument> {
        const user = await this.UserModel.findOne({
            deletedAt: null,
            'emailConfirmation.confirmationCode': code,
        });

        if (!user) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'user not found',
            });
        }

        return user;
    }
    async findByEmailNotFoundFail(email: string): Promise<UserDocument> {
        const user = await this.UserModel.findOne({ deletedAt: null, email });

        if (!user) {
            throw new DomainException({
                code: DomainExceptionCode.BadRequest,
                message: 'user not found',
                extensions: [{ message: 'email doesnt exist', field: 'email' }],
            });
        }

        return user;
    }
}
