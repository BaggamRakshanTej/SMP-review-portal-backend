import mongoose from "mongoose";
import userModel from "../models/userModel.js";

// Connect to your MongoDB database
mongoose
  .connect(
    "mongodb+srv://admin:admin@mycluster.esu35ar.mongodb.net/SMP-review-portal-trail?retryWrites=true&w=majority&appName=MyCluster",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database connection error: ", err));

// Function to update recommendations for each user
const updateRecommendations = async () => {
  try {
    // Fetch users with indexes from 307 to 366
    const users = await userModel.find({ index: { $gte: 307, $lte: 366 } });
    const userIds = users.map((user) => user._id);

    for (const user of users) {
      const userId = user._id;
      const recommendations = userIds.filter(
        (id) => id.toString() !== userId.toString()
      );

      // Update the user's recommendations field
        await userModel.updateOne({ _id: userId }, { $set: { recommendations } });
        console.log(`user${userId}updated successfully`);
    }

    console.log("User recommendations updated successfully");
  } catch (err) {
    console.error("Error updating recommendations: ", err);
  } finally {
    mongoose.connection.close();
  }
};

updateRecommendations();
