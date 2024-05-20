import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Review from '../models/reviewModel.js';

// Register
export const registerController = async (req, res) => {
    try {
        const { firstName, lastName, username, password, role } = req.body;
        // const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).send({
                success: false,
                message: "User already exists"
            })
        } else {
            const newUser = new User({
                firstName,
                lastName,
                username,
                password,
                role
            })
            await newUser.save();
            console.log(newUser);
            return res.status(200).send({
                success: true,
                message: "User registered successfully",
                details: {
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    username: newUser.username,
                    password: newUser.password,
                    role: newUser.role
                }
            })
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in registration",
            "error": error
        })
    }
}

// Login
export const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).send({
            success: false,
            message: 'User not found'
        });
        // const hashedPassword = await bcrypt.hash(password, 10);
        
        // console.log(hashedPassword);
        // console.log(user.password);
        
        // const isMatch = await bcrypt.compare(user.password, password);
        const isMatch = (user.password === password)
        if (!isMatch) return res.status(400).send({
            success: false,
            message: 'Invalid credentials'
        });

        const token = jwt.sign({ id: user._id }, process.env.SECRET);
        return res.status(200).send({
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            "Jwt Token": token, 
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// update user controller
export const updateUserController = async (req, res) => {

}

// get a single User by his id
export const getSingleUserController = async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId });
    // console.log(user);
    if (!user) {
        return res.status(404).send({
            success: false, 
            message: "No such user"
        })
    } else {
        return res.status(200).send({
            success: true,
            details: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                reviews: user.reviews
            }
        })
    }
}

// create a review
export const createReviewController = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const reviewer = await User.findById(req.user.id);
        console.log('user: ' + user.username);
        console.log('reviewer: '+ reviewer.username);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Failed to get the details of the applicant"
            })
        } else if(!reviewer) {
            return res.status(404).send({
                success: false,
                message: "Kindly login to give the review of the applicant"
            })
        } else {
            const newReview = new Review({
                applicantName: `${user.firstName} ${user.lastName}`,
                reviewerName: `${reviewer.firstName} ${reviewer.lastName}`,
                ...req.body
            });

            await newReview.save();
            
            user.reviews.push(newReview._id);
            await user.save();

            return res.status(201).send({
                success: true,
                message: `Review added for ${user.firstName} ${user.lastName}`,
                details: newReview
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Review failed to submit",
            "error": error
        })
    }
}

// update a review
export const updateReviewController = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const reviewerId = req.user.id;
        
        // Find the review
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).send({
                success: false,
                message: "Review Not Found"
            }) 
        } else {
            const reviewer = await User.findById(reviewerId);
            if (review.reviewerName !== `${reviewer.firstName} ${reviewer.lastName}`) {
                return res.status(403).send({
                    success: false,
                    message: "You are not authorized to update this review"
                })
            }

            // Merge the existing review with the new data
            const updatedReview = { ...review._doc, ...req.body };
            Object.assign(review, updatedReview);

            await review.save();

            return res.status(200).send({
                success: true,
                message: "Review Updated Successfully",
                review
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false, 
            message: "Error in updating the review",
            "error": error
        })
    }
}

// get all reviews of a single user
export const getUserReviewsController = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('reviews');
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            })
        } else {
            return res.status(200).send({
                success: true,
                reviews: user.reviews
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false, 
            message: "Failed to get the user reviews",
            "error": error
        })
    }
}

// get all users
export const getAllUsersController = async (req, res) => {
    try {
        const users = await User.find({}).populate("firstName").populate("lastName");
        console.log(users);
        if (!users) {
            return res.status(404).send({
                success: false,
                message: "Users not found"
            })
        }
        console.log(users);

        const userNames = users.map(user => ({
            id: user._id, // Include id for React key
            fullName: `${user.firstName} ${user.lastName}`
        }));

        return res.status(200).send({
            success: true,
            users: userNames
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Failed to fetch the users",
            "error": error
        })
    }
}