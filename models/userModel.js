import mongoose, { mongo } from 'mongoose';
import reviewModel from './reviewModel.js';

const UserSchema = new mongoose.Schema({
    index: { type: Number, unique: true },
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    reviews: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
        default: []
    },

    role: { type: Boolean, default: false},
    
    recommendations: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    
    reviewedApplicants: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },

    additionalReviews: {
        type: String, 
        default: ""
    },

    isReviewComplete: {
        type: Boolean,
        default: false
    }
});

const userModel = mongoose.model('User', UserSchema);
export default userModel;


