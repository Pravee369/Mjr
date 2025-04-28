//create mini express (separate router) app
const exp=require("express");
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userApp = exp.Router();
const nodemailer = require("nodemailer");
const verifyToken=require("./middlewares/verifyToken")
const { ObjectId } = require("mongodb");
const expressAsyncHandler = require('express-async-handler')

//import multerObj
const multerObj=require("./middlewares/CloudinaryConfig");


//body parser
userApp.use(exp.json())

//CREATE USER API
 
//register user PUBLIC ROUTE
console.log("user api file")

userApp.post("/register-user", multerObj.single("photo"), async (req, res) => {
   console.log("Received user registration request");
 
   try {
     const userCollectionObj = req.app.get("userCollection");
     const newUser = req.body;
 
     // Check if user already exists
     const existingUser = await userCollectionObj.findOne({ username: newUser.username });
     if (existingUser) {
       return res.status(200).send({ message: "User already exists. Please log in." });
     }
 
     // Hash the password
     newUser.password = await bcryptjs.hash(newUser.password, 6);
     console.log("Uploaded file:", req.file);
     // If an image was uploaded, store its path
     if (req.file) {
       newUser.photo = req.file.path; // Store only the file path
     } else {
       newUser.photo = ""; // Default empty path
     }
 
     // Insert new user into the database
     await userCollectionObj.insertOne(newUser);
 
     res.status(201).send({ message: "User created successfully" });
     console.log("User registered:", newUser);
   } catch (error) {
     console.error("Error registering user:", error);
     res.status(500).send({ message: "Error registering user" });
   }
 });


//userlogin
//public route
userApp.post('/login-user',expressAsyncHandler(async(req,res)=>
{
   
   //get user collection obj
   const userCollectionObj = req.app.get("userCollection")

   //get user from client
   const userCredObj=req.body

   //verify username of the userCredObj
   let userOfDb = await userCollectionObj.findOne({username:userCredObj.username})

   //if username is invalid means not registered
   if(userOfDb===null)
   {
      res.status(200).send({message:"invalid user name please signup"})
   }

   //if username valid 
   else
   {
     let isEqual=await bcryptjs.compare(userCredObj.password,userOfDb.password)

     if(isEqual===false)
     {
      res.status(200).send({message:"invalid password"})
     }

     //if pw matched
     else
     {
        //create jwt token
        let signedJWTtoken = jwt.sign({username:userOfDb.username},process.env.SECRET_KEY,{expiresIn:"1d"})
        console.log(signedJWTtoken)
        //send token in response
     console.log("kk1")
        res.status(200).send({message:"success",token:signedJWTtoken,user:userOfDb})
        
     console.log("kk2")
     }
     console.log("dvdsal")
   }
}))

userApp.get("/filter", async (req, res) => {
   const userCollection = req.app.get("userCollection");
   const { category, specialization } = req.query;

   let filter = {};

   if (category === "Doctor") {
       filter = { category: "Doctor" };
       if (specialization) {
           filter.specialization = specialization; // Only doctors have specialization
       }
   } else if (category) {
       filter = { category: "Organization", organizationType: category };
      
       if (specialization && category==="Clinic") {
           filter["specialization"] = specialization; // Ensure organizations with specialization are filtered
       }
   }

   try {
       const results = await userCollection.find(filter).toArray();
       console.log(results)
       res.status(200).json(results);
   } catch (error) {
       console.error(error);
       res.status(500).json({ message: "Error fetching data" });
   }
});


userApp.get("/alldoctorsandhospitals", async (req, res) => {
  const userCollection = req.app.get("userCollection");
  try {
    // Fetch doctors
    const doctors = await userCollection.find({ category: "Doctor" }).toArray();

    // Fetch hospitals
    const hospitals = await userCollection.find({ category: "Organization" , organizationType:"Hospital" }).toArray();
    const clinics = await userCollection.find({ category: "Organization" , organizationType:"Clinic" }).toArray();
    

    // Return both doctors and hospitals in separate arrays
    res.status(200).json({ doctors, hospitals ,clinics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
});



userApp.get("/doctor/:id", async (req, res) => {
  const userCollection = req.app.get("userCollection")
  console.log("Received ID:", req.params.id,req.params);
  try {
    const doctor = await userCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    console.log(doctor.name)
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor details", error });
  }
});

userApp.get("/hospital/:id", async (req, res) => {
  const userCollection = req.app.get("userCollection")
  console.log("Received ID:", req.params.id,req.params);
  try {
    const hospital = await userCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.status(200).json(hospital);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hospital details", error });
  }
});

userApp.get("/get-doctor-id/:doctorEmail", async(req, res) => {
  const userCollection = req.app.get("userCollection");
  const { doctorEmail } = req.params;
  try{
    const doctor = await userCollection.findOne({ username: doctorEmail});
    if(!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor details", error });
  }
});

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Store OTPs temporarily
const otpStore = {};

// Check if email is registered
userApp.post("/check-email", async (req, res) => {
  const userCollectionObj = req.app.get("userCollection");
  const { email } = req.body;

  const user = await userCollectionObj.findOne({ username: email });
  if (!user) {
    return res.status(200).send({ success: false, message: "The entered email is not registered." });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email]=otp;

  // Send OTP via email
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    });
    console.log(`OTP Sent Successfully to ${email}: ${otp}`);
    res.status(200).send({ success: true, message: "OTP sent to your email." });
  } catch (error) {
    console.error("Error sending OTP:", error);  // Log the full error details
    res.status(500).send({ success: false, message: "Error sending OTP.", error: error.message });
  }
});

//Resend  OTP
userApp.post("/send-otp", expressAsyncHandler(async(req, res) => {
  const userCollectionObj = req.app.get("userCollection");
  const { email } = req.body;

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email]=otp

  // Send OTP via email
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    });
    console.log(`OTP Sent Successfully to ${email}: ${otp}`);
    res.status(200).send({ success: true, message: "OTP sent to your email." });
  } catch (error) {
    console.error("Error sending OTP:", error);  // Log the full error details
    res.status(500).send({ success: false, message: "Error sending OTP.", error: error.message });
  }
}));
const verifyOTP = (email, otp) => {
  console.log("Verifying OTP for email:", email, "with OTP:", otp,otpStore);
  console.log('Otp store is',otpStore,otpStore[email])
  if (otpStore[email] && otpStore[email] === otp) {
      delete otpStore[email]; // OTP is one-time use.
      return { success: true, message: 'OTP verified successfully' };
  }
  return { success: false, message: 'Invalid OTP' };
};
userApp.post('/verify-otp', expressAsyncHandler(async(req, res) => {
  const userCollectionObj = req.app.get("userCollection");
  const { email,otp } = req.body;
  
  console.log("its otp verify route for email")
  if (!email || !otp) return res.status(400).json({ success: false, message: 'Phone and OTP are required' });

  const response = verifyOTP(email, otp);
  res.json(response);
}));

// Reset Password
userApp.post("/reset-password", async (req, res) => {
  const userCollectionObj = req.app.get("userCollection");
  const { email, newPassword, confirmNewPassword } = req.body;

  const hashedPassword = await bcryptjs.hash(newPassword, 6);
  const result = await userCollectionObj.updateOne(
    { username: email },
    { $set: { password: hashedPassword, confirmPassword: confirmNewPassword } }
  );

  if (result.modifiedCount > 0) {
    res.status(200).send({ success: true, message: "Password reset successfully." });
  } else {
    res.status(500).send({ success: false, message: "Error resetting password." });
  }
});
 
userApp.get(
  "/get-all-users",
  verifyToken, // Ensure the user is authenticated
  expressAsyncHandler(async (req, res) => {
    try {
      const userCollection = req.app.get("userCollection");

      // Fetch all users from the database
      const users = await userCollection.find().toArray();

      res
        .status(200)
        .json({ message: "Users fetched successfully", payload: users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  })
);

module.exports = userApp;
