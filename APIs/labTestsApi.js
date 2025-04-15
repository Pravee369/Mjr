const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

// Middleware to parse JSON bodies is assumed to be set globally

// POST /lab-tests/add-test
// This endpoint will add a new test to the labTestsCollection.
router.post("/add-test", async (req, res) => {
  try {
    const labTestsCollection = req.app.get("labTestsCollection");
    const {
      username,
      testName,
      description,
      price,
      sampleType,
      resultTime,
      instructions,
      slotDuration,
      maxBookingsPerSlot
    } = req.body;

    // Check for existing test with same name under this lab
    const existingTest = await labTestsCollection.findOne({ username, testName });

    if (existingTest) {
      return res.status(409).json({ message: "Test with this name already exists under your lab." });
    }

    const newTest = {
      username,
      testName,
      description,
      price,
      sampleType,
      resultTime,
      instructions,
      slotDuration: parseInt(slotDuration),
      maxBookingsPerSlot: parseInt(maxBookingsPerSlot)
    };

    await labTestsCollection.insertOne(newTest);
    res.status(201).json({ message: "Test added successfully!" });

  } catch (error) {
    console.error("Error adding test:", error);
    res.status(500).json({ message: "Internal Server Error" });
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

router.post("/bookings", async (req, res) => {
  const labTestsCollection = req.app.get("labTestsCollection");
  const labTestBookingsCollection = req.app.get("labTestBookingsCollection");

  const {
    labId,
    labName,
    testName, // used as unique identifier now
    date,
    time,
    price,
    userEmail,
  } = req.body;

  try {
    console.log("Incoming booking request:", req.body);
    // Fetch the test by lab and testName
    const test = await labTestsCollection.findOne({ username: labId, testName });
    console.log("Fetched test:", test);
    if (!test) {
      console.error("Test not found for:", labId, testName);
      return res.status(404).json({ message: "Test not found." });
    }

    const slotLimit = parseInt(test.maxBookingsPerSlot);

    // Count existing bookings for same lab, testName, date, and time
    const existingBookings = await labTestBookingsCollection.countDocuments({
      labId,
      testName,
      date,
      time,
    });
    console.log("Existing bookings at this slot:", existingBookings);
    if (existingBookings >= slotLimit) {
      return res.status(400).json({ message: "Slot is already full. Please choose another time." });
    }

    // Book the slot
    const booking = {
      labId,
      labName,
      testName,
      price,
      date,
      time,
      userEmail,
      status: "Booked",
      bookedAt: new Date(),
    };

    await labTestBookingsCollection.insertOne(booking);
    console.log("✅ Booking inserted!");

    res.status(201).json({ success:true, message: "Booking successful!" });

  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET /lab-tests/bookings?labId=xxx&testName=xxx&date=yyyy-mm-dd
router.get("/bookings", async (req, res) => {
  const labTestBookingsCollection = req.app.get("labTestBookingsCollection");
  const { labId, testName, date } = req.query;

  try {
    const bookings = await labTestBookingsCollection
      .aggregate([
        {
          $match: {
            labId,
            testName,
            date,
          },
        },
        {
          $group: {
            _id: "$time",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const bookingsCountByTime = {};
    bookings.forEach((b) => {
      bookingsCountByTime[b._id] = b.count;
    });

    res.json({ bookingsCountByTime });
  } catch (err) {
    console.error("Error fetching bookings", err);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
});

// GET /lab-tests/all-bookings?labId=xxx
router.get("/all-bookings", async (req, res) => {
  const labTestBookingsCollection = req.app.get("labTestBookingsCollection");
  const { labId } = req.query;

  try {
    const bookings = await labTestBookingsCollection
      .find({ labId })
      .sort({ date: -1, time: -1 })
      .toArray();

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching all bookings", err);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
});

// GET /lab-tests/my-appointments?userEmail=example@example.com
router.get("/my-appointments", async (req, res) => {
  const labTestBookingsCollection = req.app.get("labTestBookingsCollection");
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ message: "User email is required." });
  }

  try {
    const appointments = await labTestBookingsCollection
      .find({ userEmail })
      .sort({ date: -1, time: -1 })
      .toArray();

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments." });
  }
});

// DELETE /lab-tests/cancel-appointment/:id
router.delete("/cancel-appointment/:id", async (req, res) => {
  try {
    const labTestBookingsCollection = req.app.get("labTestBookingsCollection");
    const { id } = req.params;

    const result = await labTestBookingsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Appointment cancelled successfully." });
    } else {
      res.status(404).json({ message: "Appointment not found." });
    }
  } catch (err) {
    console.error("Error cancelling appointment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE /lab-tests/tests/:testId
// This endpoint deletes a test by its ID.
router.delete("/tests/:testId", async (req, res) => {
  try {
    const { testId } = req.params;
    const labTestsCollection = req.app.get("labTestsCollection");

    // Delete the test from the database
    const result = await labTestsCollection.deleteOne({ _id: new ObjectId(testId) });

    if (result.deletedCount === 1) {
      res.status(200).json({ success: true, message: "Test deleted successfully." });
    } else {
      res.status(404).json({ success: false, message: "Test not found." });
    }
  } catch (err) {
    console.error("Error deleting test:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// PUT /lab-tests/tests/:testId
// This endpoint updates a test by its ID.
router.put("/tests/:testId", async (req, res) => {
  try {
    const { testId } = req.params;
    const labTestsCollection = req.app.get("labTestsCollection");

    const {
      testName,
      description,
      price,
      sampleType,
      resultTime,
      instructions,
      slotDuration,
      maxBookingsPerSlot
    } = req.body;

    // Update the test with the provided data
    const updatedTest = {
      testName,
      description,
      price,
      sampleType,
      resultTime,
      instructions,
      slotDuration: parseInt(slotDuration),
      maxBookingsPerSlot: parseInt(maxBookingsPerSlot)
    };

    const result = await labTestsCollection.updateOne(
      { _id: new ObjectId(testId) },
      { $set: updatedTest }
    );

    if (result.matchedCount === 1) {
      res.status(200).json({ success: true, message: "Test updated successfully." });
    } else {
      res.status(404).json({ success: false, message: "Test not found." });
    }
  } catch (err) {
    console.error("Error updating test:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


module.exports = router;
