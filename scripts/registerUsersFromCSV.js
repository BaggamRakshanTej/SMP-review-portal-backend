import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/userModel.js'; // Adjust the path to your User model

// Connect to your MongoDB
mongoose.connect(
  "mongodb+srv://admin:admin@mycluster.esu35ar.mongodb.net/SMP-review-portal?retryWrites=true&w=majority&appName=MyCluster",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const registerUser = async (user) => {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const userCount = await User.countDocuments({});
        const newUser = new User({
            index: userCount + 1,
            // index: user.index,
            fullname: user.fullname,
            username: user.username,
            password: hashedPassword,
            reviews: [],
            role: user.role || false, // Assuming default role is false(not an admin)
            recommendations: []
        });
        await newUser.save();
        console.log(`User ${user.username} registered successfully`);
    } catch (error) {
        console.error(`Error registering user ${user.username}: ${error.message}`);
    }
};

const importUsersFromCSV = () => {
    const users = [];
    fs.createReadStream("D://Projects/password.csv")
        .pipe(csv())
        .on('data', (row) => {
            users.push(row);
        })
        .on('end', async () => {
            for (const user of users) {
                await registerUser(user);
            }
            console.log('CSV file successfully processed');
            mongoose.connection.close();
        });
};

importUsersFromCSV();
