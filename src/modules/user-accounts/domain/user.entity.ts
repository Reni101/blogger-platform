import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
import {
    EmailConfirmation,
    EmailConfirmationSchema,
} from './email-confirmation.shema';
import { add } from 'date-fns';

export const loginConstraints = {
    minLength: 3,
    maxLength: 10,
};

export const passwordConstraints = {
    minLength: 6,
    maxLength: 20,
};

export const emailConstraints = {
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
};

//флаг timestemp автоматичеки добавляет поля upatedAt и createdAt
@Schema({ timestamps: true })
export class User {
    @Prop({
        type: String,
        required: true,
        min: loginConstraints.minLength,
        max: loginConstraints.minLength,
    })
    login: string;

    @Prop({
        type: String,
        required: true,
        min: passwordConstraints.minLength,
        max: passwordConstraints.minLength,
    })
    passwordHash: string;

    @Prop({
        type: String,
        required: true,
        match: emailConstraints.match,
    })
    email: string;

    // @Prop({ type: Boolean, required: true, default: false })
    // isEmailConfirmed: boolean;

    createdAt: Date;
    updatedAt: Date;

    @Prop({ type: Date, nullable: true, default: null })
    deletedAt: Date | null;

    @Prop({ type: EmailConfirmationSchema })
    emailConfirmation: EmailConfirmation;

    static createInstance(dto: CreateUserDomainDto): UserDocument {
        const user = new this();
        user.email = dto.email;
        user.passwordHash = dto.passwordHash;
        user.login = dto.login;
        user.emailConfirmation = {
            confirmationCode: 'uuid',
            expirationDate: add(new Date(), {
                days: 1,
            }),
            isConfirmed: false,
        };
        return user as UserDocument;
    }

    makeDeleted() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date();
    }

    // setConfirmationCode(code: string) {
    //     this.emailConfirmation.confirmationCode = code;
    // }
}

export const UserSchema = SchemaFactory.createForClass(User);

//регистрирует методы сущности в схеме
UserSchema.loadClass(User);

//Типизация документа
export type UserDocument = HydratedDocument<User>;

//Типизация модели + статические методы
export type UserModelType = Model<UserDocument> & typeof User;
