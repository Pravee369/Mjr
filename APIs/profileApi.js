const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const verifyToken = require("./middlewares/verifyToken");
const multerObj = require("./middlewares/CloudinaryConfig");
const router = express.Router();

router.use(express.json());

router.put(
  "/edit-profile",
  verifyToken,
  multerObj.single("photo"),
  expressAsyncHandler(async (req, res) => {
    try {
      const usersCollection = req.app.get("userCollection");
      const { _id, ...updateData } = req.body;
      if (req.file) {
        updateData.photo = req.file.path;
      }
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
