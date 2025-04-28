const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const verifyToken = require("./middlewares/verifyToken");
const pharmaciesApi = express.Router();
const { ObjectId } = require("mongodb");
const twilio = require("twilio");

pharmaciesApi.use(express.json());

// Fetch all orders for the pharmacy
pharmaciesApi.get(
  "/orders",
  verifyToken, // Ensure the user is authenticated
  expressAsyncHandler(async (req, res) => {
    try {
      const ordersCollection = req.app.get("ordersCollection");
      const orders = await ordersCollection.find().toArray();
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).send({ message: "Failed to fetch orders." });
    }
  })
);

// Add a new order when a user places an order
pharmaciesApi.post(
  "/orders",
  verifyToken, // Ensure the user is authenticated
  expressAsyncHandler(async (req, res) => {
    const { userName, email, phone, address, cart, pharmacyId } = req.body;

    if (
      !userName ||
      !email ||
      !phone ||
      !address ||
      !cart ||
      cart.length === 0
    ) {
      return res.status(400).send({ message: "All fields are required." });
    }

    try {
      const ordersCollection = req.app.get("ordersCollection");

      const newOrder = {
        userName,
        email,
        phone,
        address,
        cart,
        pharmacyId,
        createdAt: new Date(),
        status: "Pending", // Default status for new orders
      };

      const result = await ordersCollection.insertOne(newOrder);

      res.status(201).send({
        message: "Order placed successfully.",
        orderId: result.insertedId,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).send({ message: "Failed to place order." });
    }
  })
);

pharmaciesApi.get("/medicines", async (req, res) => {
  try {
    const medicinesCollection = req.app.get("medicinesCollection");
    const pharmacyId = req.query.pharmacyId; // Get pharmacyId from query params

    if (!pharmacyId) {
      return res.status(400).json({ message: "Pharmacy ID is required." });
    }

    // Fetch medicines for the specific pharmacy
    const medicines = await medicinesCollection.find({ pharmacyId }).toArray();

    res.status(200).json(medicines);
  } catch (err) {
    console.error("Error fetching medicines:", err);
    res.status(500).json({ message: "Failed to fetch medicines." });
  }
});

pharmaciesApi.post("/medicines", async (req, res) => {
  try {
    const medicinesCollection = req.app.get("medicinesCollection");
    const {
      name,
      price,
      stock,
      composition,
      uses,
      sideEffects,
      pharmacyId,
      image,
    } = req.body;
    const newMedicine = {
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      composition,
      uses,
      sideEffects,
      pharmacyId,
      image,
      available: true,
    };
    await medicinesCollection.insertOne(newMedicine);
    res.status(201).json({ message: "Medicine added successfully." });
  } catch (err) {
    console.error("Error adding medicine:", err);
    res.status(500).json({ message: "Failed to add medicine." });
  }
});

pharmaciesApi.put(
  "/medicines/:id",
  verifyToken, // Ensure the user is authenticated
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params; // Medicine ID from the URL
    const { available } = req.body; // New availability state from the request body

    if (typeof available !== "boolean") {
      return res.status(400).json({ message: "Invalid availability state." });
    }

    try {
      const medicinesCollection = req.app.get("medicinesCollection");

      // Update the medicine's availability
      const result = await medicinesCollection.updateOne(
        { _id: new ObjectId(id) }, // Filter by medicine ID
        { $set: { available } } // Update the `available` field
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Medicine not found." });
      }

      res
        .status(200)
        .json({ message: "Medicine availability updated successfully." });
    } catch (err) {
      console.error("Error updating medicine availability:", err);
      res
        .status(500)
        .json({ message: "Failed to update medicine availability." });
    }
  })
);
const client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
pharmaciesApi.put(
  "/orders/:id",
  verifyToken, // Ensure the user is authenticated
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params; // Order ID
    const { status, rejectionReason } = req.body; // Status and optional rejection reason

    try {
      const ordersCollection = req.app.get("ordersCollection");

      if (status === "Rejected") {
        // Remove the order from the database if rejected
        const result = await ordersCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Order not found." });
        }

        // Simulate notifying the user via telephone
        console.log(
          `User notified via telephone: Order ${id} rejected. Reason: ${rejectionReason}`
        );
        await client.messages.create({
                body: `Order ${id} rejected. Reason: ${rejectionReason}`,
                from: process.env.TWILIO_NUMBER,
                to: '+918985071044'
            });

        return res
          .status(200)
          .json({ message: "Order rejected and user notified." });
      } else if (status === "Accepted") {
        // Update the order status to "Accepted"
        const result = await ordersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "Accepted" } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Order not found." });
        }
        await client.messages.create({
          body:`Order ${id} Accepted. You will be contacted by the Seller Shortly.`,
          from:process.env.TWILIO_NUMBER,
          to:'+918985071044'
        })
        return res
          .status(200)
          .json({ message: "Order accepted successfully." });
      } else {
        return res.status(400).json({ message: "Invalid status." });
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      res.status(500).json({ message: "Failed to update order status." });
    }
  })
);

pharmaciesApi.get("/orders/accepted", async (req, res) => {
  try {
    const ordersCollection = req.app.get("ordersCollection");
    const pharmacyId = req.query.pharmacyId; // Get pharmacyId from query params

    if (!pharmacyId) {
      return res.status(400).json({ message: "Pharmacy ID is required." });
    }

    // Fetch accepted orders for the specific pharmacy
    const acceptedOrders = await ordersCollection
      .find({ pharmacyId, status: "Accepted" })
      .toArray();

    res.status(200).json(acceptedOrders);
  } catch (err) {
    console.error("Error fetching accepted orders:", err);
    res.status(500).json({ message: "Failed to fetch accepted orders." });
  }
});

module.exports = pharmaciesApi;
