const express = require("express");
const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const verifyToken=require("./middlewares/verifyToken")
const healthlogApp = express.Router();

// Body parser
healthlogApp.use(express.json());
const multer = require('multer');
const upload = multer();


healthlogApp.post('/upload', upload.none(),verifyToken, expressAsyncHandler(async (req, res) => {
    const healthlogCollectionObj = req.app.get("healthlogCollection");
    console.log("Form Data:", req.body); // req.body should now contain your form fields
    const newDoc = JSON.parse(req.body.healthdata);
    console.log("Parsed Health Data:", newDoc);
    try {
        await healthlogCollectionObj.insertOne(newDoc);
        res.status(201).send({ message: "Health data uploaded successfully" });
    } catch (error) {
        console.error("Error posting document:", error);
        res.status(400).send({ message: "Health data not uploaded, Something went wrong" });
    }
}));



healthlogApp.get('/get-healthlogs',verifyToken, expressAsyncHandler(async (request, response) => {
  console.log("healthlog get api");

  const healthlogCollectionObj = request.app.get("healthlogCollection");
  let allhealthlogs;

  try {
      allhealthlogs = await healthlogCollectionObj.find().toArray();
      console.log("All Health Logs:", allhealthlogs);
  } catch (error) {
      console.error("Error fetching health logs from the database:", error);
      return response.status(500).send({ message: "Internal server error" });
  }

  let logs = [];
  const authHeader = request.headers['authorization'];
  let username = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
          const decoded = jwt.verify(token, process.env.SECRET_KEY);
          username = decoded.username;
      } catch (err) {
          console.error('Token verification failed:', err);
          return response.status(401).send({ message: 'Invalid or expired token' });
      }
  } else {
      return response.status(401).send({ message: 'No token provided' });
  }

  for (let log of allhealthlogs) {
      if (log.username === username) {
          logs.push(log);
      }
  }

  console.log("Filtered Logs:", logs);
  response.status(200).send({ message: "Got all healthlogs", payload: logs });
}));



module.exports = healthlogApp;
