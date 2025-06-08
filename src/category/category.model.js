import { Schema, model } from 'mongoose';
 
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: 50
    },
    description: {
        type: String,
        maxLength: 200
    }
}, { timestamps: true });
 
export default model('Category', categorySchema);