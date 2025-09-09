import { Extension } from '../domain-exceptions';

export type ErrorResponseBody = {
    // timestamp: string;
    // path: string | null;
    // message: string;
    // code: DomainExceptionCode;
    errorsMessages: Extension[];
};
