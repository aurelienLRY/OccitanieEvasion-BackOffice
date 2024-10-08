import mongoose, { Schema, model } from 'mongoose';

/* Types */
import { IUser } from '@/types';




const UserSchema = new Schema<IUser>({
    name: { type: String, required: true , default: "name" },
    email: { type: String, unique: true, required: true , match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/ , "Email invalide"]},
    password: { type: String, required: true },
    username: { type: String, required: true , default: "username" },
}, { timestamps: true });

const User = mongoose.models?.User || model<IUser>('User', UserSchema);
export default User;