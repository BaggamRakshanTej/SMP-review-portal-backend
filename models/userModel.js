import mongoose from 'mongoose';
import reviewModel from './reviewModel.js';

const UserSchema = new mongoose.Schema({
    index: { type: Number, unique: true },
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    role: { type: Boolean, default: false},
    recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const userModel = mongoose.model('User', UserSchema);
export default userModel;