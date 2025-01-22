const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middlewares/verifyToken");
const organBankApi = express.Router();
const { ObjectId } = require("mongodb");

// Body parser
organBankApi.use(express.json());
const multer = require("multer");
const upload = multer();

organBankApi.post(
  "/send-organ-request",
  upload.none(),
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    console.log(req)
    const healthlogCollectionObj = req.app.get("organBanksCollection");
    console.log("Form Data to post for organbanksrequest:", req.body); // req.body should now contain your form fields
    const newDoc = req.body;
    console.log("Parsed data to send to organ banks request:", newDoc);
    try {
      await healthlogCollectionObj.insertOne(newDoc);
      res.status(201).send({ message: "Organ requirement request sent successfully" });
    } catch (error) {
      console.error("Error while requesting for the specific organ:", error);
      res
        .status(400)
        .send({ message: "Request not sent, Something went wrong" });
    }
  })
);

organBankApi.get(
  "/get-required-organ",
  verifyToken,
  expressAsyncHandler(async (request, response) => {
    console.log("Organ Bank Get api");

    const healthlogCollectionObj = request.app.get("organBanksCollection");
    let allhealthlogs;

    try {
      allhealthlogs = await healthlogCollectionObj.find().toArray();
      console.log("All the requested organs:", allhealthlogs);
    } catch (error) {
      console.error("Error fetching requested organs from the database:", error);
      return response.status(500).send({ message: "Internal server error in organ banks" });
    }

    let logs = [];
    const authHeader = request.headers["authorization"];
    let username = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        username = decoded.name;
      } catch (err) {
        console.error("Token verification failed:", err);
        return response
          .status(401)
          .send({ message: "Invalid or expired token" });
      }
    } else {
      return response.status(401).send({ message: "No token provided" });
    }

   
    response.status(200).send({ message: "Got all healthlogs", payload: allhealthlogs });
  })
);

organBankApi.put(
  "/update-organ-request/:id", // Route with ID parameter
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    const healthlogCollectionObj = req.app.get("organBanksCollection");

    // Check if the collection is accessible
    if (!healthlogCollectionObj) {
      return res.status(500).send({ message: "Organ Banks collection not found" });
    }

    const { id } = req.params; // Extracting ID from route parameters
    const updateData = req.body; // New data for the document update
    console.log("ID received from request:", id); // Log the received ID

    // Check for a valid ObjectId
    if (!ObjectId.isValid(id) || id.length !== 24) {
      console.log("Invalid ID format detected"); // Log if the format is incorrect
      return res.status(400).send({ message: "Invalid ID format" });
    }

    try {
      const result = await healthlogCollectionObj.updateOne(
        { _id: new ObjectId(id) }, // Filter document by ID
        { $set: updateData } // Set the new data fields to update
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({ message: "Organ request not found" });
      }

      res.status(200).send({ message: "Organ request updated successfully" });
    } catch (error) {
      console.error("Error updating the organ request:", error);
      res.status(500).send({ message: "Failed to update organ request" });
    }
  })
);

module.exports = organBankApi;