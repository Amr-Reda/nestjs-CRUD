import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { genSalt, hash } from 'bcryptjs';

export type UserDocument = User & Document;

@Schema()
export class User {

    @Prop({required: true})
    name: string;

    @Prop({unique: true, required: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop()
    image: string;

    @Prop({required: true, enum: Object.values(Object.freeze({
        ADMIN: "Admin",
        USER: "User",
    }))})
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Encrypt password using bcrypt
UserSchema.pre('save', async function () {
	if (this.password && this.isModified('password')) {
		const salt = await genSalt(9);
		this.password = await hash(this.password, salt);
    }
});