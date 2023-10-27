 const User =require("../models/user");
 const BigPromise = require("../middlewares/bigPromise")
 const CustomError= require("../utils/customError");
const jwt= require("jsonwebtoken");



//not only verify token is present or not but also enject some info
 exports.isLoggedIn = BigPromise(async(req, res, next)=>{

//extract the token
const token= req.cookies.token || req.header("Authorization").replace("Bearer", "");

if(!token){
    return next(new CustomError(`first login to access this page`, 401))
}
//decode token
const decoded= jwt.verify(token, process.env.JWT_SECRET)
req.user = await User.findById(decoded.id)  //here we are injecting user in our req object (req body)
next();
 })


 

 //
 //to decide role //admin or user  ////roles=array =='manager'
 exports.customRole=(...roles)=>{ 
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
return next(new CustomError("You are not allowed for this resources", 403));
        }
        next();
    }

 };