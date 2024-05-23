import mongoose from 'mongoose';
import User from '../models/userModel.js'; // Adjust the import path as needed

const addIndexToUsers = async () => {
    await mongoose.connect(
      "mongodb+srv://admin:admin@mycluster.esu35ar.mongodb.net/SMP-review-portal-trail?retryWrites=true&w=majority&appName=MyCluster",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const users = await User.find({});
    for (let i = 0; i < users.length; i++) {
        // await User.updateOne({ _id: users[i]._id }, { index: i });
        await User.updateOne({ _id: users[i]._id }, { reviews: [], submittedReviews: [] });
        console.log(`done for ${users[i].fullname}`)
    }
    console.log('Indexes added to existing users');
    mongoose.disconnect();
};

addIndexToUsers();
