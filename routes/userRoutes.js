import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
const router = express.Router();

// import {
//     registerController,
//     loginController,
//     getSingleUserController,
//     createReviewController,
//     updateReviewController,
//     getUserReviewsController,
//     getAllUsersController,
//     getRecommendedUsersController,
//   addAdditionalReviewController,
//     declareCompletionController
// } from '../controllers/userController.js';
// import { auth, isAdmin, restrictAccess } from '../middleware/authMiddleware.js';

// // Register
// router.post('/register', registerController);

// // Login
// router.post('/login', loginController);

// // create review
// router.post('/createReview/:userId', auth, createReviewController);

// // update review
// router.put('/updateReview/:reviewId', auth, updateReviewController);

// // get recommended users
// router.get('/getUser/:userId/recommendations',auth, getRecommendedUsersController);

// // get all users
// router.get('/getAllUsers', auth, getAllUsersController);

// // get the user by id
// router.get('/getUser/:userId', getSingleUserController);

// // get reviews of a particular user
// router.get('/:userId/reviews', auth, isAdmin, getUserReviewsController);

// // protected routes for user
// router.get("/user-auth", auth, (req, res) => {
//   res.status(200).send({ ok: true });
// });

// // protected routes for admin
// router.get("/admin-auth", auth, isAdmin, (req, res) => {
//   res.status(200).send({ ok: true });
// });

// router.post(
//   "/addAdditionalReview/:userId",
//   auth,
//   restrictAccess,
//   addAdditionalReviewController
// );
// router.post(
//   "/declareCompletion/:userId",
//   auth,
//   declareCompletionController
// );


// export default router;

import {
  registerController,
  loginController,
  getSingleUserController,
  createReviewController,
  updateReviewController,
  getUserReviewsController,
  getAllUsersController,
  getRecommendedUsersController,
  addAdditionalReviewController,
  declareCompletionController,
} from "../controllers/userController.js";

import {
  auth,
  isAdmin,
  restrictAccess,
  hasCompletedReview,
} from "../middleware/authMiddleware.js";

// const router = express.Router();

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// create review
router.post(
  "/createReview/:userId",
  auth,
  hasCompletedReview,
  createReviewController
);

// update review
router.put(
  "/updateReview/:reviewId",
  auth,
  hasCompletedReview,
  updateReviewController
);

// get recommended users
router.get(
  "/getUser/:userId/recommendations",
  auth,
  hasCompletedReview,
  getRecommendedUsersController
);

// get all users
router.get("/getAllUsers", auth, hasCompletedReview, getAllUsersController);

// get the user by id
router.get(
  "/getUser/:userId",
  auth,
  hasCompletedReview,
  getSingleUserController
);

// get reviews of a particular user
router.get("/:userId/reviews", auth, isAdmin, getUserReviewsController);

// protected routes for user
router.get("/user-auth", auth, (req, res) => {
  res.status(200).send({ ok: true });
});

// protected routes for admin
router.get("/admin-auth", auth, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.post(
  "/addAdditionalReview/:userId",
  auth,
  restrictAccess,
  hasCompletedReview,
  addAdditionalReviewController
);
router.post("/declareCompletion/:userId", auth, declareCompletionController);

export default router;
