// const express = require("express");
// const app = express();
// const path = require("path");
// const bodyParser = require("body-parser");
// const MongoClient = require("mongodb").MongoClient;
// const twilio = require("twilio");
// const verifyToken = require("./APIs/middlewares/verifyToken");

// const port = process.env.PORT || 3000;

// // Middleware to parse JSON bodies
// app.use(bodyParser.json());

// // Connect express with React build
// app.use(express.static(path.join(__dirname, './build')));

// // MongoDB URI
// const mongoURI = "mongodb://localhost:27017/healthDB";

// // Twilio setup
// const accountSid = 'AC16dbe992a3f9f760e854c94588780d69'; // Replace with your Twilio Account SID
// const authToken = 'b5f9777de0183d8d8eed013792f48607'; // Replace with your Twilio Auth Token
// const client = twilio(accountSid, authToken);
// const twilioNumber = '+19124612457'; // Replace with your Twilio number


// const formatPhoneNumber = (phoneNumber) => {
//   // Assuming phone numbers are provided in the local format, e.g., 898507XXXX
//   // Add the country code (e.g., +91 for India)
//   const countryCode = '+91'; // Change this to the appropriate country code if needed
//   if (!phoneNumber.startsWith('+')) {
//     return `${countryCode}${phoneNumber}`;
//   }
//   return phoneNumber;
// };
// // Function to send SMS
// const sendSMS = (to, body) => {
//   let formattedNumber = formatPhoneNumber(to);
//   client.messages.create({
//     body: body,
//     from: twilioNumber,
//     to: formattedNumber
//   })
//   .then(message => console.log(`Message sent: ${message.sid}`))
//   .catch(error => console.error('Error sending message:', error));
// };

// // Check and send SMS for due alarms
// const checkAlarms = async (db) => {
//   setInterval(async () => {
//     let now = new Date();
//     let currentTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
//     let currentDate = now.toISOString().split('T')[0];
//     try {
//       let alarms = await db.collection('alarms').find({ date: currentDate, time: currentTime }).toArray();
//       alarms.forEach(alarm => {
//         sendSMS(alarm.phoneNumber, `Alarm: ${alarm.label}`);
//       });
//     } catch (error) {
//       console.error('Error checking alarms:', error);
//     }
//   }, 60000); // Check every minute
// };

// // Connect to MongoDB server
// MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(client => {
//     const db = client.db("healthDB");
//     const userCollection = db.collection("userscollection");
//     const docCollection = db.collection("docCollection");
//     const alarmCollection = db.collection("alarms");
//     const healthlogCollection=db.collection("healthlogCollection");
//     const bloodBanksCollection = db.collection("bloodBanksRequest");

//     app.set("userCollection", userCollection);
//     app.set("docCollection", docCollection);
//     app.set("alarmCollection", alarmCollection);
//     app.set("healthlogCollection", healthlogCollection);
//     app.set("bloodBanksCollection",bloodBanksCollection);

//     console.log("db connection success");

//     // Start checking alarms
//     checkAlarms(db);
//   })
//   .catch(err => {
//     console.log("error in db connection", err);
//   });

// // Routes for alarms
// app.post('/alarms',verifyToken, async (req, res) => {
//   const { date, time, label, phoneNumber, userName } = req.body;
//   const alarm = { date, time, label, phoneNumber: formatPhoneNumber(phoneNumber), userName };
//   try {
//     const alarmCollection = req.app.get("alarmCollection");
//     await alarmCollection.insertOne(alarm);
//     res.send(alarm);
//   } catch (error) {
//     console.error('Error creating alarm:', error);
//     res.status(500).send({ message: 'Error creating alarm' });
//   }
// });


// app.get('/alarms',verifyToken, async (req, res) => {
//   try {
//     const alarmCollection = req.app.get("alarmCollection");
//     const alarms = await alarmCollection.find().toArray();
//     res.send(alarms);
//   } catch (error) {
//     console.error('Error fetching alarms:', error);
//     res.status(500).send({ message: 'Error fetching alarms' });
//   }
// });


// // Import user and document APIs
// const userApp = require("./APIs/userApi");
// const docApp = require("./APIs/documentApi");
// const healthlogApp = require("./APIs/healthlogApi");
// const bloodBanks=require("./APIs/bloodBank");


// app.use("/user-api", userApp);
// app.use("/doc-api", docApp);
// app.use("/healthlog-api", healthlogApp);
// app.use("/blood-banks",bloodBanks);


// // Page refresh handling
// app.use('/*', (req, res, next) => {
//   res.sendFile(path.join(__dirname, './build/index.html'), err => {
//     if (err) {
//       next(err);
//     }
//   });
// });

// // Invalid path middleware
// app.use("*", (req, res) => {
//   res.status(404).send({ message: "Invalid path" });
// });

// // Error handling middleware
// app.use((error, req, res, next) => {
//   console.error('Error occurred:', error.message);
//   res.status(500).send({ message: error.message });
// });

// // Start the server
// app.listen(port, () => console.log(`Server listening on port ${port}`));
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const twilio = require("twilio");
const verifyToken = require("./APIs/middlewares/verifyToken");

const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect express with React build
app.use(express.static(path.join(__dirname, './build')));

// MongoDB URI
const mongoURI = "mongodb://127.0.0.1:27017/healthDB";

// Twilio setup
const accountSid = 'AC16dbe992a3f9f760e854c94588780d69'; // Replace with your Twilio Account SID
const authToken = 'b5f9777de0183d8d8eed013792f48607'; // Replace with your Twilio Auth Token
const client = twilio(accountSid, authToken);
const twilioNumber = '+19124612457'; // Replace with your Twilio number


const formatPhoneNumber = (phoneNumber) => {
  // Assuming phone numbers are provided in the local format, e.g., 898507XXXX
  // Add the country code (e.g., +91 for India)
  const countryCode = '+91'; // Change this to the appropriate country code if needed
  if (!phoneNumber.startsWith('+')) {
    return `${countryCode}${phoneNumber}`;
  }
  return phoneNumber;
};
// Function to send SMS
const sendSMS = (to, body) => {
  let formattedNumber = formatPhoneNumber(to);
  client.messages.create({
    body: body,
    from: twilioNumber,
    to: formattedNumber
  })
  .then(message => console.log(`Message sent: ${message.sid}`))
  .catch(error => console.error('Error sending message:', error));
};

// Check and send SMS for due alarms
const checkAlarms = async (db) => {
  setInterval(async () => {
    let now = new Date();
    let currentTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    let currentDate = now.toISOString().split('T')[0];
    try {
      let alarms = await db.collection('alarms').find({ date: currentDate, time: currentTime }).toArray();
      alarms.forEach(alarm => {
        sendSMS(alarm.phoneNumber, `Alarm: ${alarm.label}`);
      });
    } catch (error) {
      console.error('Error checking alarms:', error);
    }
  }, 60000); // Check every minute
};

// Connect to MongoDB server
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db("healthDB");
    const userCollection = db.collection("userscollection");
    const docCollection = db.collection("docCollection");
    const alarmCollection = db.collection("alarms");
    const healthlogCollection=db.collection("healthlogCollection")
    const bloodBanksCollection = db.collection("bloodBanksRequest");
    const organBanksCollection = db.collection("organBanksRequest");
    const equipmentRentersCollection = db.collection("equipmentRentersRequest");
    app.set("userCollection", userCollection);
    app.set("docCollection", docCollection);
    app.set("alarmCollection", alarmCollection);
    app.set("healthlogCollection", healthlogCollection);
    app.set("bloodBanksCollection",bloodBanksCollection);
    app.set("organBanksCollection",organBanksCollection);
    app.set("equipmentRentersCollection",equipmentRentersCollection);
    console.log("db connection success");

    // Start checking alarms
    checkAlarms(db);
  })
  .catch(err => {
    console.log("error in db connection", err);
  });

// Routes for alarms
app.post('/alarms',verifyToken, async (req, res) => {
  const { date, time, label, phoneNumber, userName } = req.body;
  const alarm = { date, time, label, phoneNumber: formatPhoneNumber(phoneNumber), userName };
  try {
    const alarmCollection = req.app.get("alarmCollection");
    await alarmCollection.insertOne(alarm);
    res.send(alarm);
  } catch (error) {
    console.error('Error creating alarm:', error);
    res.status(500).send({ message: 'Error creating alarm' });
  }
});


app.get('/alarms',verifyToken, async (req, res) => {
  try {
    const alarmCollection = req.app.get("alarmCollection");
    const alarms = await alarmCollection.find().toArray();
    res.send(alarms);
  } catch (error) {
    console.error('Error fetching alarms:', error);
    res.status(500).send({ message: 'Error fetching alarms' });
  }
});


// Import user and document APIs
const userApp = require("./APIs/userApi");
const docApp = require("./APIs/documentApi");
const healthlogApp = require("./APIs/healthlogApi");
const bloodBanks=require("./APIs/bloodBanksApi");
const organBanks=require("./APIs/organBanksApi");
const equipRenters=require("./APIs/equipRentersApi");


app.use("/user-api", userApp);
app.use("/doc-api", docApp);
app.use("/healthlog-api", healthlogApp);
app.use("/blood-banks",bloodBanks);
app.use("/organ-banks",organBanks);
app.use("/equipment-renters",equipRenters);

// Page refresh handling
app.use('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, './build/index.html'), err => {
    if (err) {
      next(err);
    }
  });
});

// Invalid path middleware
app.use("*", (req, res) => {
  res.status(404).send({ message: "Invalid path" });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error occurred:', error.message);
  res.status(500).send({ message: error.message });
});

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}`));