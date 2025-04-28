const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const twilio = require("twilio");
const verifyToken = require("./APIs/middlewares/verifyToken");


const port = process.env.PORT ;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect express with React build
app.use(express.static(path.join(__dirname, './build')));

// MongoDB URI
const mongoURI = process.env.MONGO_URI;

// Twilio setup
const accountSid = process.env.ACCOUNT_SID; // Replace with your Twilio Account SID
const authToken = process.env.AUTH_TOKEN; // Replace with your Twilio Auth Token
const client = twilio(accountSid, authToken);
const twilioNumber = process.env.TWILIO_NUMBER; // Replace with your Twilio number


const formatPhoneNumber = (phoneNumber) => {
  
  const countryCode = process.env.COUNTRY_CODE; // Change this to the appropriate country code if needed
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
    const appointmentsCollection = db.collection("appointments")
    const verificationsCollection = db.collection("verificationsCollection");
    const leavesCollection=db.collection("leaves")
    const bookedSlotsCollection= db.collection("bookedSlotsCollection");
    const labTestsCollection = db.collection("labTestsCollection");
    const hcServicesCollection=db.collection("hcServicesCollection");
    const labTestBookingsCollection = db.collection("labTestBookingsCollection");
    const ordersCollection = db.collection("ordersCollection");
    const medicinesCollection=db.collection("medicinesCollection")
    app.set("userCollection", userCollection);
    app.set("docCollection", docCollection);
    app.set("alarmCollection", alarmCollection);
    app.set("healthlogCollection", healthlogCollection);
    app.set("bloodBanksCollection",bloodBanksCollection);
    app.set("organBanksCollection",organBanksCollection);
    app.set("equipmentRentersCollection",equipmentRentersCollection);
    app.set("appointmentsCollection",appointmentsCollection);
    app.set("verificationsCollection", verificationsCollection);
    app.set("leavesCollection",leavesCollection)
    app.set("bookedSlotsCollection",bookedSlotsCollection);
    app.set("labTestsCollection", labTestsCollection);
    app.set("hcServicesCollection",hcServicesCollection);
    app.set("labTestBookingsCollection", labTestBookingsCollection);
    app.set("ordersCollection", ordersCollection);
    app.set("medicinesCollection",medicinesCollection)

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
const { otpAuth } = require('./APIs/otpAuth');
const profile = require('./APIs/profileApi');
const aptment = require("./APIs/appointmentApi");
const verifications = require('./APIs/verificationApi');
const leaveApp = require("./APIs/leavesApi")
const chatbotApi = require("./APIs/chatbotApi");
const labsApi = require("./APIs/labsApi");
const labTestsApi = require("./APIs/labTestsApi");
const hcApi=require("./APIs/HCservicesApi");
const pharmaciesApi = require("./APIs/pharmaciesApi");

app.use("/pharmacies", pharmaciesApi);
app.use("/user-api", userApp);
app.use("/doc-api", docApp);
app.use("/healthlog-api", healthlogApp);
app.use("/blood-banks",bloodBanks);
app.use("/organ-banks",organBanks);
app.use("/equipment-renters",equipRenters);
app.use('/otp-auth', otpAuth);
app.use("/profile-api", profile);
app.use("/appointment-api",aptment);
app.use("/verifications-api", verifications);
app.use("/leaves-api",leaveApp)
app.use("/chatbot-api",chatbotApi);
app.use("/labs-api", labsApi);
app.use("/lab-tests", labTestsApi);
app.use("/hc-api",hcApi);


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