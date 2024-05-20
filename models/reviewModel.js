import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    applicantName: {type: String, required: true},
    reviewerName: { type: String, required: true },
    approachability: {
        rating: {
            type: Number,
            required: true
        },
        description: { 
            type: String, 
            default: ""
            // required: function() { return this.approchability.rating <= 2; } 
        }
    },
    academicInclination: {
        rating: { type: Number, required: true },
        description: { 
            type: String, 
            default: ""
            // required: function() { return this.academicInclination.rating <= 2; } 
        }
    },
    workEthics: {
        rating: { type: Number, required: true },
        description: { 
            type: String,
            default: ""
            // required: function() { return this.workEthics.rating <= 2; } 
        }
    },
    substanceAbuse: { type: String },
    maturity: {
        rating: { type: Number, required: true },
        description: { 
            type: String, 
            default: ""
            // required: function() { return this.maturity.rating <= 2; } 
        }
    },
    openMindedness: {
        rating: { type: Number, required: true },
        description: { 
            type: String, 
            default: ""
            // required: function() { return this.openMindedness.rating <= 2; } 
        }
    },
    academicEthics: {
        rating: { type: Number, required: true },
        description: { 
            type: String, 
            default: ""
            // required: function() { return this.academicEthics.rating <= 2; } 
        }
    },
    goodISMPmentor: { type: String, required: true },
    additionalComments: { type: String, required: true }
}, { timestamps: true });

const reviewModel = mongoose.model('Review', ReviewSchema);
export default reviewModel;