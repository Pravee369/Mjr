const cloudinary = require("cloudinary").v2;
const multer = require("multer")
const {CloudinaryStorage}=require("multer-storage-cloudinary")

require('dotenv').config()

cloudinary.config({

    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

//configure cloudinary storage
let clStorage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"MinorProject",
        public_id:(request,file)=>file.fieldname+"-"+Date.now()
    }

})

//configure multer
let multerObj=multer({storage:clStorage})

//export multerObj
module.exports=multerObj;