export const createUserQuery =
    'INSERT INTO "Users"' +
    ' ("login", "email", "passwordHash","createdAt","confirmationCode","expirationDate","isConfirmed")' +
    ' VALUES ($1, $2, $3,$4,$5,$6,$7) RETURNING *';
