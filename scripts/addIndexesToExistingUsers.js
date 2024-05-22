import mongoose from 'mongoose';
import User from '../models/userModel.js'; // Adjust the import path as needed

const addIndexToUsers = async () => {
    await mongoose.connect('mongodb://localhost:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true });

    const users = await User.find({});
    for (let i = 0; i < users.length; i++) {
        // await User.updateOne({ _id: users[i]._id }, { index: i });
        await User.updateOne({ _id: users[i]._id }, { reviews: [] });
        console.log(`done for ${users[i].fullname}`)
    }
    console.log('Indexes added to existing users');
    mongoose.disconnect();
};

addIndexToUsers();
