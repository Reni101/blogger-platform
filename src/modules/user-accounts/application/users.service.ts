import { Injectable } from '@nestjs/common';
import { UserDocument } from '../domain/user.entity';
import {
    DomainException,
    Extension,
} from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class UsersService {
    validateUniqueUser(
        uniqueUser: UserDocument | null,
        dto: { login: string; email: string },
    ) {
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
