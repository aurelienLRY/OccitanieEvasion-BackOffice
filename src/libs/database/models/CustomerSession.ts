import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ICustomerSession extends Document {
    _id: string;
    sessionId: string;
    date: Date;
    status: string;
    typeOfReservation: string;
    number_of_people: number;
    last_name: string;
    first_names: string;
    email: string;
    phone: string;
    people_list: {
        size: string;
        weight: string;
    }[];
}

const CustomerSessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, required: true },
    typeOfReservation: { type: String, required: false},
    number_of_people: { type: Number, required: true },
    last_name: { type: String, required: true },
    first_names: { type: String, required: true },
    email: { type: String, required: true , match: [/.+@.+\..+/, "Email invalide"] },
    phone: { type: String, required: true },
    people_list: [{
        size: { type: String, required: true },
        weight: { type: String, required: true }
    }]
});

CustomerSessionSchema.pre('save', async function (next) {
    if (this.isModified('last_name') || this.isModified('first_names')) {
        this.last_name = this.last_name.toUpperCase();
        this.first_names = this.first_names.toUpperCase();
        this.last_name = await bcrypt.hash(this.last_name, 10);
        this.first_names = await bcrypt.hash(this.first_names, 10);
    }
    if (this.isModified('email')) {
        this.email = this.email.toLowerCase();
        this.email = await bcrypt.hash(this.email, 10);
    }
    if (this.isModified('phone')) {
        this.phone = await bcrypt.hash(this.phone, 10);
    }
    next();
});

const CustomerSession = mongoose.models.CustomerSession || mongoose.model<ICustomerSession>('CustomerSession', CustomerSessionSchema);
export default CustomerSession;