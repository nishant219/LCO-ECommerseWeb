const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const mailHelper = require("../utils/emailHelper");
const crypto = require("crypto");

//exports.NameOfController =BigPromise(async(err,req,res,next)=>{})
 

//signup controller
exports.signup = BigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;
  
  if ( !name || !email || !password) {
    return next(new CustomError("Name, email and password are required", 400));
    //return next(new Error("Please send error"));  //raise error without custom error
  }

  let result;
  //first check img is there or not
  if (!req.files) {
    return next(new CustomError("photo is required for signup", 400));
  }
  
  let file = req.files.photo;
  //upload img =cloudinary.v2.uploader.upload(file,{})
    result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "scale",
  });

  
  //create User object = user in database based on model schema
  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  //as user successfully signup on web we are sending cookieToken 
   cookieToken(user, res);
  
});




//login route
exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new CustomError("please provide email and password", 400));
  }
  //as we have designed schema select:false we have to provide +password explicitely
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new CustomError("You are not registered in the db", 400));
  }

  //if user present then validate password  //with the help of methods in models
  const isPasswordCorrect = await user.isValidatedPassword(password);

  if (!isPasswordCorrect) {
    new CustomError("Email or password does not match or exist", 400);
  }
  //now everything is fine, so we can send the token
  cookieToken(user, res);
});




//logout -> we are deleting tokens manually  //jwt tokens are stateless, 
exports.logout = BigPromise(async (req, res, next) => {
  //you have value 'token' make it null and set expirary now
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout success",
  });
});



//forgot pasword
//user will send email in json/body then we will shoot email on that mail
exports.forgotPassword = BigPromise(async (req, res, next) => {
  
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new CustomError(`Email not found as a registered`, 400));
  }

  const forgotToken = user.getForgotPasswordToken();  //method from model - to generate token(string)

  await user.save({ validateBeforeSave: false });

  //send this forgotToken to user   //craft url for that =>   /password/reset/:token
  const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`;
  //craft msg
  const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;

  //send email  //in the try(succ) & catch(err)
  try {
    //mailHelper from utils //email,sub & msg
    await mailHelper({
      email: user.email,
      subject: "Password reset email",
      message,
    });
    //after successfully sending email msg for user
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    //flush this things
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    
    await user.save({ validateBeforeSave: false });
    return next(new CustomError(error.message, 500));
  }

});




//  paswordReset
//visit url from reset mail, match that token with db token if yes then chage password  
exports.passwordReset = BigPromise(async (req, res, next) => {
//grab the token //that token is not encrypted 
const token = req.params.token;
//we have to encrypt it
const encryToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");


//find user based on the encrypted token(encryToken) + user whose forgotPasswordExpiry is in future
const user = await User.findOne({
  encryToken,
  forgotPasswordExpiry: {$gt: Date.now()}
})

//if user not found
if(!user){
return next(new CustomError(`Token is invalid or expired`,400))
}

if(req.body.password !== req.body.confirmedPasword){
  return next(new CustomError(`entered pass and confirmed pass does not matched`, 400))
}
//fill the new pass
user.password= req.body.password

user.forgotPasswordToken = undefined;
user.forgotPasswordExpiry = undefined;

//save new password
await user.save();

//send a json or send token
cookieToken(user, res);

});



//userDashboard -->getLoggedInUserDetails
exports.getLoggedInUserDetails = BigPromise(async(req,res,next)=>{
  const user=await User.findById(req.user.id);
  res.status(200).json({
    success:true,
    user,
  })

});



//reset->when you dont know the old pass
//changePassword -> when you know the old password 
//this route is visible only if user logged in(middleware)
exports.changePassword= BigPromise(async(req, res, next)=>{
  const userId= req.user.id;
  const user= await User.findById(userId).select("+password");
  //check pass old&new
  const isCorrectOldPassword = await user.isValidatedPassword(req.body.oldPassword);

  if(!isCorrectOldPassword){
    return next(new CustomError("old password is not found", 400));
  }
  //update old pass with new
  user.password=req.body.password 
  //save it
  await user.save();
  //update token
  cookieToken(user, res);
    
});



//update user details
exports.updateUserDetails=BigPromise(async(req,res,next)=>{
  
  //to update name and email
  const newData={
    name:req.body.name,
    email:req.body.email
  };

  let result;

  //to update image
  if(req.files){
    //delete previous photo and upload new one
    const user= await User.findById(req.user.id);
    const imgId=user.photo.id;
    const resp =await cloudinary.v2.uploader.destroy(imgId);//photo deleted
  
    //upload img =cloudinary.v2.uploader.upload(file,{})
    result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });
  
//we can grab this 2 thing from clodinary via new uploaded photo -> result
  newData.photo={
    id: result.public_id,
    secure_url: result.secure_url
  };
  }else{
      //when no files
      return next(new CustomError("please upload a file", 400));
  }

  const user=await User.findByIdAndUpdate(req.user.id, newData, {
    new:true,
    runValidators:true,
    useFindAndModify:false,
  } );
  res.status(200).json({
    sucess:true,
    //you can pass entire user (user)here if frontend needs it
  })

});



//admin route --> adminAllUser
//
exports.adminAllUser= BigPromise(async(req,res,next)=>{
 const users=await User.find({}); //finds and returns all users (array)
 res.status(200).json({
  sucess:true,
  users,
 })
});



//admin get single user 
//for single user grab id from url
exports.adminGetOneUser= BigPromise(async(req,res,next)=>{
  const user= await User.findById(req.params.id); 
   
  if(!user){
    next(new CustomError("NO user found",400));
  }
  res.status(200).json({
    sucess:true,
    user,
  });
 });



////adminUpdateOneUser users details
//
exports.adminUpdateOneUser=BigPromise(async(req,res,next)=>{
  
const newData={
  name: req.body.name,
  email: req.body.email,
  role: req.body.role
};
  //( , , {})
  const user=await User.findByIdAndUpdate(req.params.id, newData, {
    new:true,
    runValidators:true,
    useFindAndModify:false,
  } );
  res.status(200).json({
    sucess:true,
    //you can pass entire user (user)here if frontens needs it
  })

});



//adminUpdateOneUser users details
//first delete photo then user to keep track 
//
exports.adminDeleteOneUser=BigPromise(async(req,res,next)=>{
  const user = await User.findById(req.params.id);
  if(!user){
return next(new CustomError("No such user found", 401));
  }
  //just grab image id then use cloudinaries destroy method
  const imageId =user.photo.id;
  await cloudinary.v2.uploader.destroy(imageId);
  await user.remove();

  res.status(200).json({
    sucess:true,
  });
  
  });
  


//manager only controller //it grabs only--> role:"user"
//manager can only accesss accounts whose role is user
exports.managerAllUser= BigPromise(async(req,res,next)=>{
  const users=await User.find({role:"user"}); 
  res.status(200).json({
   sucess:true,
   users,
  })
 });


