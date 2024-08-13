import mongoose, { Schema, model } from 'mongoose';

export interface ISpot extends Document {
    _id: string;
    name: string;
    description: string;
    gpsCoordinates: string;
    practicedActivities: string[];
    photo: string;
    half_day: boolean;
    full_day: boolean;
    max_OfPeople: number;
    min_OfPeople: number;
    meetingPoint: string;
    estimatedDuration: string;
}

const SpotSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    gpsCoordinates: {
      type: String,
      required: true,
    },
    practicedActivities: [{
      activityName: {
        type: String,
        required: false,
      },
      activityId: {
        type: Schema.Types.ObjectId,
        required: false,
      },
    }],
    photo: {
      type: String,
      required: false,
    },
    half_day: {
      type: Boolean,
      required: true,
    },
    full_day: {
      type: Boolean,
      required: true,
    },
    max_OfPeople: {
      type: Number,
      required: true,
    },
    min_OfPeople: {
      type: Number,
      required: true,
    },
    meetingPoint: {
      type: String,
      required: false,
    },
    estimatedDuration: {
      type: String,
      required: false,
    },
  });

  const Spot = mongoose.models.Spot || mongoose.model<ISpot>('Spot', SpotSchema);
  export default Spot;