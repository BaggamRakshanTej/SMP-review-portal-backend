import mongoose from "mongoose";
import userModel from "../models/userModel.js";

// Connect to your MongoDB database
mongoose
  .connect(
    "mongodb+srv://admin:admin@mycluster.esu35ar.mongodb.net/SMP-review-portal?retryWrites=true&w=majority&appName=MyCluster",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database connection error: ", err));

// Function to create and save users
const registerUsers = async () => {
  try {
    const users = [];

    for (let i = 61; i <= 61; i++) {
      const user = new userModel({
        // index: i + 306,
        index: i + 306,
        fullname: `name${i}`,
        username: `user${i}`,
        password: `user${i}`,
        reviews: [],
        role: false,
        recommendations: [],
        reviewedApplicants: [],
        additionalReviews: "",
        isReviewComplete: false,
      });
        users.push(user);
        console.log(`user${i} created successfully`)
    }

      await userModel.insertMany(users);
      console.log(users);
    console.log("Users registered successfully");
  } catch (err) {
    console.error("Error registering users: ", err);
  } finally {
    mongoose.connection.close();
  }
};

registerUsers();
