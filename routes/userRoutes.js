import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
const router = express.Router();

import {
    registerController,
    loginController,
    // getSingleUserController,
    createReviewController,
    updateReviewController,
    getUserReviewsController,
    getAllUsersController
} from '../controllers/userController.js';
import { auth, isAdmin } from '../middleware/authMiddleware.js';

// Register
router.post('/register', registerController);

// Login
router.post('/login', loginController);

// get the user by id
// router.get('/:userId', getSingleUserController)

// create review
router.post('/createReview/:userId', auth, createReviewController);

// update review
router.put('/updateReview/:reviewId', auth, updateReviewController);

// get all users
router.get('/getAllUsers', auth, isAdmin, getAllUsersController);

// get reviews of a particular user
router.get('/:userId/reviews', auth, isAdmin, getUserReviewsController);

export default router;