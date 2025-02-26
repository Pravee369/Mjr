const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const verifyToken = require("./middlewares/verifyToken"); // Middleware for authentication
// const User = require("../models/User"); // Assuming you have a User model
const router = express.Router();

// Middleware to parse JSON
router.use(express.json());

// Update logged-in user profile
router.put(
  "/edit-profile",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    try {
        const usersCollection = req.app.get("userCollection"); // Access users collection
        console.log("Decoded token data:", req.user);
        const { _id, ...updateData } = req.body;
        const result = await usersCollection.findOneAndUpdate(
          { username: req.user.username },
          { $set: updateData },
          { returnDocument: "after" }
        );
  
        if (!result) return res.status(404).json({ message: "User not found" });
  
        res.status(200).json({ message: "Profile updated successfully", payload: result });
      } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Failed to update profile" });
      }
  })
);

module.exports = router;
