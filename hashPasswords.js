import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/userModel.js';

dotenv.config();

async function hashPasswords() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Fetch all users
        const users = await User.find({});
        console.log(`Fetched ${users.length} users`);

        // Iterate over each user and hash their password if not already hashed
        for (const user of users) {
            if (user.password && !user.password.startsWith('$2b$')) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                user.password = hashedPassword;
                await user.save();
                console.log(`Password for user ${user.username} has been hashed`);
            }
        }

        console.log('All user passwords have been hashed');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error hashing passwords:', error);
        mongoose.connection.close();
    }
}

hashPasswords();
