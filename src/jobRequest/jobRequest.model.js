import { Schema, model } from 'mongoose';

const jobRequestSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  worker: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  agreedPrice: { 
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING'
  }
}, { timestamps: true });

export default model('JobRequest', jobRequestSchema);
