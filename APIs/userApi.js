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
userApp.post("/register-user",expressAsyncHandler(async(req,res)=>
{
   console.log("its userapi register")
   console.log("uyjgbj",req.body)
   //get userCollection
   const userCollectionObj=req.app.get("userCollection")

   //get user from client
   //const newUser = JSON.parse(req.body)
   const newUser=req.body;
   console.log("dfghjkl",newUser)
   //verify user already  exist or not
   const userOfdb = await userCollectionObj.findOne({username:newUser.username})

   if(userOfdb!==null)
   {
    res.status(200).send({message:"User already exist ..Please Login"})
   }

   else
   {
      let hashedpw = await bcryptjs.hash(newUser.password,6);
      newUser.password = hashedpw;
      //newUser.image=req.file.path;
      //insert user
      await userCollectionObj.insertOne(newUser);

      res.status(201).send({message:"User created"})
      console.log("user added")
   }

}))


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



module.exports = userApp;
