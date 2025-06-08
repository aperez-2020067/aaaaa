import { Schema, model } from 'mongoose';
 
const chatSchema = new Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    messages: [
        {
            sender: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            text: {
                type: String
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });
 
export default model('Chat', chatSchema);