const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middlewares/verifyToken");
const { ObjectId } = require("mongodb");
const hcApi = express.Router();

// Body parser
hcApi.use(express.json());
const multer = require("multer");
const upload = multer();
console.log("HCapi api file")

hcApi.put('/services/:id', async (req, res) => {
  const { id } = req.params; // This is hospital ID
  const hcServicesCollection = req.app.get("hcServicesCollection");
  const updatedServices = req.body;

  try {
    // Check if service entry exists
    const existing = await hcServicesCollection.findOne({ hospitalId: id });

    if (existing) {
      // Update existing document
      const result = await hcServicesCollection.findOneAndUpdate(
        { hospitalId: id },
        { $set: { ...updatedServices } },
        { returnDocument: 'after' } // returns updated doc
      );
      res.json(result.value);
    } else {
      // First time insert
      const result = await hcServicesCollection.insertOne({
        hospitalId: id,
        ...updatedServices
      });
      res.json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save/update services' });
  }
});


hcApi.get('/servicesOfHospital/:id', async (req, res) => {
  const { id } = req.params; // hospitalId from URL
  const hcServicesCollection = req.app.get("hcServicesCollection");

  try {
    // Find service details for the hospital
    const hospitalServices = await hcServicesCollection.findOne({ hospitalId: id });

    if (!hospitalServices) {
      return res.status(404).json({ message: "No services found for this hospital." });
    }

    res.json(hospitalServices);
  } catch (err) {
    console.error("Error fetching hospital services:", err);
    res.status(500).json({ error: "Failed to fetch hospital services." });
  }
});

  

module.exports =hcApi;