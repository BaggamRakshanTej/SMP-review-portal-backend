import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
const PORT = process.env.PORT || 8080;

dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
import userRoutes from './routes/userRoutes.js';

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/user', userRoutes);

// Starting the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
