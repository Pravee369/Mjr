//create mini express (separate router) app
const exp=require("express");
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userApp = exp.Router();
const verifyToken=require("./middlewares/verifyToken")

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
       if(category==="Clinic")
       {
         filter["specialization"] = specialization;
       }
      //  if (specialization) {
      //      filter["specialization"] = specialization; // Ensure organizations with specialization are filtered
      //  }
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

module.exports = userApp;
