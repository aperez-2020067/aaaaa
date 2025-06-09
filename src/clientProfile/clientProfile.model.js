import { Schema, model } from 'mongoose';

const clientProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  location: {
    type: String
  },
  ratingAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
}, {
  timestamps: true
});

export default model('ClientProfile', clientProfileSchema);
