import mongoose, { Schema, model } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    username: string;
}

const UserSchema = new Schema({

    email: { type: String, unique: true, required: true , match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/ , "Email invalide"]},
    password: { type: String, required: true },
    username: { type: String, required: true , default: "User" },
}, { timestamps: true });

const User = mongoose.models?.User || model<IUser>('User', UserSchema);
export default User;