import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const auth = (req, res, next) => {

  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) { return res.status(401).send('Access denied.'); }
  // token = token.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        console.log('Decoded JWT:', decoded); // Debugging line to ensure decoding works
        next();
    } catch (error) {
      console.log(error)
      return res.status(400).send('Invalid token');
  }
  
};

//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    console.log(req);
    const user = await User.findById(req.user.id);
    console.log(user.role);
    if (user.role !== true) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
        user
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};

// This is if the applicant has submitted the reviews already
export const restrictAccess = async (req, res, next) => {
  const userId = req.userId; // Assuming userId is set by verifyToken middleware
  const user = await User.findById(userId);

  if (user && user.isReviewComplete) {
    return res.status(403).send({
      success: false,
      message:
        "You have declared your reviews complete and cannot access this resource",
    });
  }

  next();
};

// Middleware to check if user has completed their review
export const hasCompletedReview = (req, res, next) => {
  if (req.user && req.user.isReviewComplete) {
    return res.status(403).send({
      success: false,
      message: "You have already completed the review process and cannot perform this action."
    });
  }
  next();
};

