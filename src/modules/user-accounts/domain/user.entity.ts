import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { UpdateUserDto } from '../dto/create-user.dto';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';

//флаг timestemp автоматичеки добавляет поля upatedAt и createdAt
@Schema({ timestamps: true })
export class User {
    @Prop({ type: String, required: true })
    login: string;

    @Prop({ type: String, required: true })
    passwordHash: string;

    @Prop({ type: String, min: 5, required: true })
    email: string;

    @Prop({ type: Boolean, required: true, default: false })
    isEmailConfirmed: boolean;

    // // @Prop(NameSchema) this variant from docdoesn't make validation for inner object
    // @Prop({ type: NameSchema })
    // name: Name;

    createdAt: Date;
    updatedAt: Date;

    @Prop({ type: Date, nullable: true })
    deletedAt: Date | null;

    // если ипсльзуете по всей системе шв айди как string, можете юзать, если id
    // get id() {
    //     // @ts-ignore
    //     return this._id.toString();
    // }

    /**
     * Factory method to create a User instance
     * @param {CreateUserDto} dto - The data transfer object for user creation
     * @returns {UserDocument} The created user document
     * DDD started: как создать сущность, чтобы она не нарушала бизнес-правила? Делегируем это создание статическому методу
     */
    static createInstance(dto: CreateUserDomainDto): UserDocument {
        const user = new this();
        user.email = dto.email;
        user.passwordHash = dto.passwordHash;
        user.login = dto.login;
        user.isEmailConfirmed = false; // пользователь ВСЕГДА должен после регистрации подтверждить свой Email

        // user.name = {
        //     firstName: 'firstName xxx',
        //     lastName: 'lastName yyy',
        // };

        return user as UserDocument;
    }

    /**
     * Marks the user as deleted
     * Throws an error if already deleted
     * @throws {Error} If the entity is already deleted
     * DDD сontinue: инкапсуляция (вызываем методы, которые меняют состояние\св-ва) объектов согласно правилам этого объекта
     */
    makeDeleted() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date();
    }

    /**
     * Updates the user instance with new data
     * Resets email confirmation if email is updated
     * @param {UpdateUserDto} dto - The data transfer object for user updates
     * DDD сontinue: инкапсуляция (вызываем методы, которые меняют состояние\св-ва) объектов согласно правилам этого объекта
     */
    update(dto: UpdateUserDto) {
        if (dto.email !== this.email) {
            this.isEmailConfirmed = false;
            this.email = dto.email;
        }
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

//регистрирует методы сущности в схеме
UserSchema.loadClass(User);

//Типизация документа
export type UserDocument = HydratedDocument<User>;

//Типизация модели + статические методы
export type UserModelType = Model<UserDocument> & typeof User;
