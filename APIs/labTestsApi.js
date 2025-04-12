const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

// Middleware to parse JSON bodies is assumed to be set globally

// POST /lab-tests/add-test
// This endpoint will add a new test to the labTestsCollection.
router.post("/add-test", async (req, res) => {
  try {
    const testObj = req.body; 
    // Ensure that testObj contains:
    // testName, description, sampleType, price, resultTime, instructions, and labId (optional for linking to lab)

    // Get the labTestsCollection from app context
    const labTestsCollection = req.app.get("labTestsCollection");

    // Insert the test object into the collection
    const result = await labTestsCollection.insertOne(testObj);

    res.status(201).send({
      message: "Test added successfully",
      testId: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding test:", error);
    res.status(500).send({ message: "Failed to add test" });
  }
});

// GET /lab-tests/tests
// This endpoint fetches tests. You can filter by labId (passed as query param) if needed.
// GET /lab-tests/tests
router.get("/tests", async (req, res) => {
  try {
    const { username } = req.query;
    const labTestsCollection = req.app.get("labTestsCollection");

    const filter = username ? { username } : {};
    const tests = await labTestsCollection.find(filter).toArray();

    res.status(200).json(tests);
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).send({ message: "Failed to fetch tests" });
  }
});


module.exports = router;
