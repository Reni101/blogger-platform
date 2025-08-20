import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    _id: false,
})
export class EmailConfirmation {
    @Prop({ required: true, type: String })
    confirmationCode: string;

    @Prop({ type: Date, required: true })
    expirationDate: Date;

    @Prop({ type: Boolean, default: false, required: true })
    isConfirmed: boolean;
}

export const EmailConfirmationSchema =
    SchemaFactory.createForClass(EmailConfirmation);
