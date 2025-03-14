const exp = require("express");
const { ObjectId } = require("mongodb");
const verificationApp = exp.Router();

verificationApp.use(exp.json());


verificationApp.get("/check-hospital/:hospitalId", async (req, res) => {
    const userCollection = req.app.get("userCollection");
    const hospitalUsername = req.params.hospitalId;
  
    try {
      const hospital = await userCollection.findOne({ 
        username: hospitalUsername, 
        category: "Organization", 
        organizationType: "Hospital" 
      });
  
      if (!hospital) {
        return res.status(404).json({ message: "The hospital with the ID entered is not registered on our website." });
      }
  
      res.status(200).json({ message: "Hospital exists" });
    } catch (error) {
      res.status(500).json({ message: "Error checking hospital ID", error });
    }
  });  

verificationApp.get("/user-verification/:doctorEmail", async (req, res) => {
    try {
      const verificationsCollection = req.app.get("verificationsCollection");
      const doctorEmail = req.params.doctorEmail;
      
      const request = await verificationsCollection.findOne({ doctorEmail });
      if (!request) {
        return res.status(200).json({ message: "No previous verification requests found." });
      }
      res.status(200).json(request);
    } catch (error) {
      console.error("Error fetching verification request:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });  

verificationApp.post("/request-verification", async (req, res) => {
  try {
    const verificationsCollection = req.app.get("verificationsCollection");
    const userCollection = req.app.get("userCollection");

    const { doctorEmail, hospitalEmailId } = req.body;

    if (!doctorEmail || !hospitalEmailId) {
      return res.status(400).json({ message: "Doctor email and hospital ID are required." });
    }

    const hospital = await userCollection.findOne({ username: hospitalEmailId, category: "Organization", organizationType: "Hospital" });

    if (!hospital) {
      return res.status(404).json({ message: "The hospital with the given ID is not registered." });
    }

    const doctor = await userCollection.findOne({ username: doctorEmail, category: "Doctor" });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor account not found." });
    }

    const sameRequest = await verificationsCollection.findOne({ doctorEmail, hospitalEmailId });
    if (sameRequest) {
      return res.status(200).json({ message: "A verification request has already been sent with the same Hospital Email ID." });
    }
    const existingRequest = await verificationsCollection.findOne({ doctorEmail });

    const newRequest = {
    doctorEmail,
    hospitalEmailId,
    doctorName: doctor.name,
    doctorMobile: doctor.mobile,
    doctorGender: doctor.gender,
    specialization: doctor.specialization || "Not Provided",
    licenseNumber: doctor.licenseNumber || "Not Provided",
    experience: doctor.experience || "Not Provided",
    doctorPhoto: doctor.photo || "",
    location: doctor.location,
    status: "pending",
    requestedAt: new Date(),
    };

    if (existingRequest) {
    await verificationsCollection.updateOne(
        { doctorEmail },
        { $set: newRequest }
    );
    return res.status(200).json({ message: "Verification request updated successfully." });
    } else {
    await verificationsCollection.insertOne(newRequest);
    return res.status(201).json({ message: "Verification request sent successfully." });
    }
    } catch (error) {
        console.error("Error sending verification request:", error);
        res.status(500).json({ message: "Internal server error." });
    }
    });

verificationApp.delete("/delete-verification/:doctorEmail", async (req, res) => {
    try {
      const verificationsCollection = req.app.get("verificationsCollection");
      const doctorEmail = req.params.doctorEmail;
  
      const deleteResult = await verificationsCollection.deleteOne({ doctorEmail });
      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ message: "No existing verification request found to delete." });
      }
      res.status(200).json({ message: "Your verification request has been successfully deleted." });
    } catch (error) {
      console.error("Error deleting verification request:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });

    verificationApp.get("/verification-requests/:hospitalEmailId", async (req, res) => {
    try {
        const verificationsCollection = req.app.get("verificationsCollection");
        const hospitalEmailId = req.params.hospitalEmailId;

        const verificationRequests = await verificationsCollection.find({ hospitalEmailId }).toArray();

        res.status(200).json(verificationRequests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

verificationApp.put("/update-status/:requestId", async (req, res) => {
  try {
    const verificationsCollection = req.app.get("verificationsCollection");
    const { status } = req.body;
    const requestId = req.params.requestId;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update." });
    }

    const updateResult = await verificationsCollection.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: "Verification request not found." });
    }

    res.status(200).json({ message: `Verification request ${status}.` });
  } catch (error) {
    console.error("Error updating verification status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = verificationApp;
