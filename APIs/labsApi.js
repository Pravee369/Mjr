const exp = require("express");
const labApp = exp.Router();
const { ObjectId } = require("mongodb");

// Body parser
labApp.use(exp.json());

// Get All Labs
labApp.get("/labs", async (req, res) => {
  const userCollection = req.app.get("userCollection");

  try {
    const labs = await userCollection.find({
      category: "Organization",
      organizationType: "Laboratory"
    }).toArray();

    res.status(200).json(labs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch labs" });
  }
});

// Search Labs
labApp.get("/labs/search", async (req, res) => {
  const userCollection = req.app.get("userCollection");
  const { query } = req.query;

  try {
    const labs = await userCollection.find({
      category: "Organization",
      organizationType: "Laboratory",
      $or: [
        { name: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } }
      ]
    }).toArray();

    res.status(200).json(labs);
  } catch (error) {
    res.status(500).json({ message: "Failed to search labs" });
  }
});

// Get Single Lab Details
labApp.get("/labs/:id", async (req, res) => {
  const userCollection = req.app.get("userCollection");
  const { id } = req.params;

  try {
    const lab = await userCollection.findOne({ _id: new ObjectId(id) });
    res.status(200).json(lab);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lab details" });
  }
});

module.exports = labApp;
