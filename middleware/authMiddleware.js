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