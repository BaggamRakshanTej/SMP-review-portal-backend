import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
const router = express.Router();

import {
    registerController,
    loginController,
    getSingleUserController,
    createReviewController,
    updateReviewController,
    getUserReviewsController,
    getAllUsersController,
    getRecommendedUsersController,
    getUserRecommendationsByReviewerNameController
} from '../controllers/userController.js';
import { auth, isAdmin } from '../middleware/authMiddleware.js';

// Register
router.post('/register', registerController);

// Login
router.post('/login', loginController);

// create review
router.post('/createReview/:userId', auth, createReviewController);

// update review
router.put('/updateReview/:reviewId', auth, updateReviewController);

// get recommended users
router.get('/getUser/:userId/recommendations',auth, getRecommendedUsersController);

// get recommended users by using name
router.get('/getUser/recommendations/:reviewerName', auth, getUserRecommendationsByReviewerNameController);

// get all users
router.get('/getAllUsers', auth, getAllUsersController);

// get the user by id
router.get('/getUser/:userId', getSingleUserController);

// get reviews of a particular user
router.get('/:userId/reviews', auth, isAdmin, getUserReviewsController);

// protected routes for user
router.get("/user-auth", auth, (req, res) => {
  res.status(200).send({ ok: true });
});

// protected routes for admin
router.get("/admin-auth", auth, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;