const app=require("./app.js");
const connectionWithDb = require("./config/db.js");
require("dotenv").config();
const cloudinary =require("cloudinary");

//db connection
connectionWithDb();


//cloudinary config goes here
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});


app.listen(process.env.PORT, ()=>{
    console.log(`Server is running at port:${process.env.PORT}`);
});