import mongoose from "mongoose";
import bcrypt from "bcrypt";
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

// Function to hash and update passwords
const hashPasswords = async () => {
  try {
    // Fetch users with indexes from 1 to 60
    const users = await userModel.find({ index: { $gte: 307, $lte: 366 } });

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Update the user's password field
      await userModel.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );
    }

    console.log("User passwords hashed and updated successfully");
  } catch (err) {
    console.error("Error hashing and updating passwords: ", err);
  } finally {
    mongoose.connection.close();
  }
};

hashPasswords();
