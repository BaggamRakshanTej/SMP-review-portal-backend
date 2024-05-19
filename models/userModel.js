import mongoose from 'mongoose';
import reviewModel from './reviewModel.js';

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    role: { type: Boolean, default: false}
});

const userModel = mongoose.model('User', UserSchema);
export default userModel;