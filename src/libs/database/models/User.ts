import mongoose, { Schema, model } from 'mongoose';

/* Types */
import { IUser } from '@/types';




const UserSchema = new Schema<IUser>({

    email: { type: String, unique: true, required: true , match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/ , "Email invalide"]},
    password: { type: String, required: true },
    username: { type: String, required: true , default: "User" },
}, { timestamps: true });

const User = mongoose.models?.User || model<IUser>('User', UserSchema);
export default User;