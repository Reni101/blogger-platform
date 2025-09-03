import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, userId) {
        if (err || !userId) {
            // здесь можно выбросить любую свою ошибку
            throw new DomainException({
                code: DomainExceptionCode.Unauthorized,
                message: 'Unauthorized',
            });
        }
        return userId;
    }
}
