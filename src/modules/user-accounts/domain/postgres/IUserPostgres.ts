export interface IUserPostgres {
    id: number;
    login: string;
    email: string;
    passwordHash: string;
    recoveryCode: string | null;
    createdAt: Date;
    deletedAt: Date | null;

    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
}
