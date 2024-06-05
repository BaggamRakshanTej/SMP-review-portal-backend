// // scripts/updateRecommendations.js

import fs from 'fs';
import mongoose from 'mongoose';
import User from '../models/userModel.js'; // Adjust the import path as needed

const jsonFilePath = "D://Projects/recommendations.json";

const updateRecommendations = async () => {
  await mongoose.connect(
    "mongodb+srv://admin:admin@mycluster.esu35ar.mongodb.net/SMP-review-portal?retryWrites=true&w=majority&appName=MyCluster",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  try {
    // Read the JSON file
    const recommendationsData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

    for (const [fullname, recommendations] of Object.entries(recommendationsData)) {
      // Convert usernames to user IDs
      const user = await User.findOne({ fullname });
      if (user) {
        const recommendationIds = await User.find({ fullname: { $in: recommendations } }).select('_id');
        const recommendationIdsArray = recommendationIds.map(user => user._id);
        
        // Update the user with the recommendations array
        await User.updateOne({ fullname }, { recommendations: recommendationIdsArray });
        console.log(`Recommendations for user ${fullname}: ${recommendationIdsArray}`);
      } else {
        console.log(`User ${fullname} not found in the database.`);
      }
    }

    console.log('Recommendations updated successfully');
  } catch (error) {
    console.error('Error updating recommendations:', error);
  } finally {
    mongoose.disconnect();
  }
}

updateRecommendations();


// This code is for the csv file import recommendations
// -----------------------------------------------------------------------------------
// import fs from 'fs';
// import csv from 'csv-parser';
// import mongoose from 'mongoose';
// import User from '../models/userModel.js'; // Adjust the import path as needed

// const csvFilePath = 'D://Projects/slots_peer_review-final.csv';

// const updateRecommendations = async () => {

//   await mongoose.connect("mongodb+srv://admin:admin@mycluster.esu35ar.mongodb.net/SMP-review-portal-trail?retryWrites=true&w=majority&appName=MyCluster",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });

//   const users = await User.find({});
//   // console.log(users[1].index);
//   const userMap = {};
//   users.forEach(user => {
//     userMap[user.index] = user._id;
//   });
//   // console.log(userMap);
//   try {
//     const results = [];
//     fs.createReadStream(csvFilePath)
//       .pipe(csv({ headers: false }))
//       .on('data', (data) => results.push(Object.values(data)))
//       .on('end', async () => {
//         // console.log('CSV Data:', results); 
//         for (let i = 0; i < results.length; i++) {
//           const recommendations = [];
//           for (let j = 0; j < results[i].length; j++) {
//             if (results[i][j] == 1) { //cant use === coz it is being imported from csv file.
//               recommendations.push(userMap[j]);
//             }
//           }
//           // Update the user with the recommendations array
//           await User.updateOne({ index: i }, { recommendations });
//           console.log(`Recommendations for user ${i}: `+recommendations)
//         }
//         console.log('Recommendations updated successfully');
//         mongoose.disconnect();
//       });
//   } catch (error) {
//     console.error('Error updating recommendations:', error);
//     mongoose.disconnect();
//   }
// }
// -------------------------------------------------------------------------------------------- 
updateRecommendations();
