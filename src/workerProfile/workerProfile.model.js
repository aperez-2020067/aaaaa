import { Schema, model } from 'mongoose';

const workerProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: {
    type: String,
    maxLength: 500
  },
  location: {
    type: String
  },
  experienceYears: {
    type: Number,
    default: 0
  },
  ratingAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, { timestamps: true });

export default model('WorkerProfile', workerProfileSchema);
