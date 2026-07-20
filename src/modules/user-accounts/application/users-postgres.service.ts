import { Injectable } from '@nestjs/common';
import {
    DomainException,
    Extension,
} from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { UsersPostgresRepository } from '../infastructure/postgres/users.postgres.repository';

@Injectable()
export class UsersPostgresService {
    constructor(
        private readonly usersPostgresRepository: UsersPostgresRepository,
    ) {}

    async validateUniqueUser(dto: { login: string; email: string }) {
        const uniqueUser =
            await this.usersPostgresRepository.findUniqueUser(dto);
        if (uniqueUser) {
            const extensions: Extension[] = [];
            if (uniqueUser.login === dto.login) {
                extensions.push({
                    field: 'login',
                    message: 'login already exists',
                });
            }
            if (uniqueUser.email === dto.email) {
                extensions.push({
                    field: 'email',
                    message: 'email already exists',
                });
            }

            throw new DomainException({
                code: DomainExceptionCode.BadRequest,
                message: 'error creating users',
                extensions,
            });
        }
    }
}
