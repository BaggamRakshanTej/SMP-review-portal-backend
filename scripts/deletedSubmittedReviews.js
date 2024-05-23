import User from "../models/userModel.js";

User.updateMany({}, { $unset: { submittedReviews: 1 } }, (err, result) => {
  if (err) {
    console.error("Error removing submittedReviews:", err);
    return res.status(500).send({
      success: false,
      message: "Error removing submittedReviews",
      error: err,
    });
  }
  console.log("Successfully removed submittedReviews from all documents");
  return res.status(200).send({
    success: true,
    message: "Successfully removed submittedReviews from all documents",
  });
});
