import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IUserPostgres } from '../../domain/postgres/IUserPostgres';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { createUserQuery } from '../../api/postgres/querys';

@Injectable()
export class UsersPostgresRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async findById(id: number) {
        const users = await this.dataSource.query<IUserPostgres[]>(
            'SELECT * FROM "Users" WHERE id = $1',
            [id],
        );
        return users[0];
        // return this.UserModel.findOne({ _id: id, deletedAt: null });
    }

    async findUniqueUser(dto: {
        login: string;
        email: string;
    }): Promise<IUserPostgres | null> {
        const users = await this.dataSource.query<IUserPostgres[]>(
            'SELECT * FROM "Users" WHERE email = $1 OR login = $2 LIMIT 1',
            [dto.email, dto.login],
        );
        return users[0];
    }

    async findOrNotFoundFail(id: number) {
        const user = await this.findById(id);

        if (!user) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'user not found',
            });
        }

        return user;
    }

    async createUser(user: Omit<IUserPostgres, 'id'>) {
        const res = await this.dataSource.query<IUserPostgres[]>(
            createUserQuery,
            [
                user.login,
                user.email,
                user.passwordHash,
                user.createdAt,
                user.confirmationCode,
                user.expirationDate,
                user.isConfirmed,
            ],
        );
        return res[0].id;
    }
}
