import mongoose, { Schema, model } from 'mongoose';

export interface ISession extends Document {
    _id: string;
    status: string;
    date: Date;
    startTime: string;
    endTime: string;
    activity: string;
    spot: string;
    placesMax: number;
    placesReserved: number;
}

const sessionSchema = new mongoose.Schema({
    status: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    activity: { type: String, required: true },
    spot: { type: String, required: true },
    placesMax: { type: Number, required: true },
    placesReserved: { type: Number, required: true },
  
  });

  const Session = mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);
  export default Session;