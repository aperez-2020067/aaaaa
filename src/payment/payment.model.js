import { Schema, model } from 'mongoose';

const paymentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    enum: ['CARD', 'PAYPAL', 'TRANSFER'],
    required: true
  },
  type: {
    type: String,
    enum: ['RECHARGE', 'JOB', 'COMMISSION'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  currency: {
    type: String,
    default: 'Q'
  }
}, { timestamps: true });

export default model('Payment', paymentSchema);
