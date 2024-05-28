import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Review from '../models/reviewModel.js';

// Register
// register the users using fullname, username, password and role(optional)
// returns success, message, details: {fullname, username, password, role}
export const registerController = async (req, res) => {
    try {
        const { fullname, username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOne({ username });
        const userCount = await User.countDocuments({});
        if (user) {
            return res.status(400).send({
                success: false,
                message: "User already exists"
            })
        } else {
            const newUser = new User({
                index: userCount + 1,
                fullname,
                username,
                password: hashedPassword,
                role
            })
            await newUser.save();
            console.log(newUser);
            return res.status(200).send({
                success: true,
                message: "User registered successfully",
                details: {
                    fullname: newUser.fullname,
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
// logs in the user using username, password
// returns success, message, details: {id, username, fullname, "JWT Token", reviewedApplicants}
export const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(404).send({
                success: false,
                message: "Username and password are required"
            })
        }
        const user = await User.findOne({ username });
        if (!user) return res.status(404).send({
            success: false,
            message: 'User not found'
        });
        // const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log(user.isReviewComplete);
        if (user.isReviewComplete === true) {
        return res.status(403).send({
            success: false,
            message: "You have completed the review process and cannot log in.",
        });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send({
            success: false,
            message: 'Invalid credentials'
        });

        const token = jwt.sign({ id: user._id }, process.env.SECRET);
        return res.status(200).send({
            success: true,
            message: "Login successful",
            details: {
                id: user._id,
                username: user.username,
                fullname: user.fullname,
                "Jwt Token": token, 
                reviewedApplicants: user.reviewedApplicants
            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Login Unsuccessful",
            error: error
        });
    }
}

// get a single User by his id
// params: userId
// returns success, message, details: {id, fullname, role, reviews, submittedReviews}
export const getSingleUserController = async (req, res) => {
    try {
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
                message: "Details obtained successfully",
                details: {
                    id: user._id,
                    fullname: user.fullname,
                    role: user.role,
                    reviews: user.reviews,
                    recommendations: user.recommendations,
                    reviewedApplicants: user.reviewedApplicants
                }
            })
        }
   
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in obtaining the data of the user",
            error: error
        })
    }
}


// get all users
export const getAllUsersController = async (req, res) => {
    try {
        const users = await User.find({}).populate("fullname");
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
            fullname: `${user.fullname}`
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

// get a set of users for each id
export const getRecommendedUsersController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('recommendations');

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        // Extract and format recommendations
        const recommendedUsers = [];
        for (const recommendationId of user.recommendations) {
            const recommendedUser = await User.findById(recommendationId);
            if (recommendedUser) {
                recommendedUsers.push({
                    id: recommendedUser._id,
                    fullname: recommendedUser.fullname,
                    username: recommendedUser.username
                });
            }
        }

        return res.status(200).send({
            success: true,
            recommendations: recommendedUsers
        });
    } catch (error) {
        console.error('Error fetching recommended users:', error);
        return res.status(500).send({
            success: false,
            message: 'Error fetching recommended users',
            error: error.message
        });
    }
}


// create a review
export const createReviewController = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const reviewer = await User.findById(req.user.id);
        console.log('user: ' + user.username);
        console.log('reviewer: ' + reviewer.username);

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
          // Check if a review already exists from this reviewer for this user
          const existingReview = await Review.findOne({
            applicantName: `${user.fullname}`,
            reviewerName: `${reviewer.fullname}`,
          });

          console.log(existingReview);

          if (existingReview) {
            return res.status(400).send({
              success: false,
              message: "Review has already been submitted.",
            });
          }

          const newReview = new Review({
            applicantName: `${user.fullname}`,
            reviewerName: `${reviewer.fullname}`,
            ...req.body,
          });

          await newReview.save();

          user.reviews.push(newReview._id);
          // Push the reviewer's ObjectId to the user's submittedReviews array
          console.log(user._id);
          user.reviewedApplicants.push(reviewer._id); // Update reviewedApplicants of the user being reviewed
          await user.save();

          return res.status(201).send({
            success: true,
            message: `Review added for ${user.fullname}`,
            details: newReview,
          });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: `Review failed to submit`,
            error: error
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

export const declareCompletionController = async (req, res) => {
  try {
    const { userId } = req.params;
      const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
      }
      console.log(user);

    user.isReviewComplete = true; // Assuming you have this field in your User model
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Review declaration submitted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to submit review declaration",
      error: error,
    });
  }
};

export const addAdditionalReviewController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { additionalReviews } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Assuming you have an `additionalReviews` field which is an array
    user.additionalReviews = additionalReviews;
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Additional review added successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to add additional review",
      error: error,
    });
  }
};

