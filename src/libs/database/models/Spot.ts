import mongoose, { Schema, model } from 'mongoose';
import { ISpot } from '@/types';



const SpotSchema = new Schema<ISpot>({
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