import { Schema, model } from 'mongoose';

const rechargeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  history: [
    {
      amount: Number,
      reference: {
        type: Schema.Types.ObjectId,
        ref: 'Payment'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

export default model('Recharge', rechargeSchema);
