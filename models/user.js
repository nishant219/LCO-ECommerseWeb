const mongoose = require("mongoose");
const validator = require("validator");  //A library of string validators and sanitizers.
const bcrypt = require("bcryptjs");   //to encrypt password/string
const jwt = require("jsonwebtoken");  
const crypto = require("crypto");  //default nodejs package to generate random string


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"], //if true : err msg
    maxlength: [40, "Name should be under 40 character"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    validate: [validator.isEmail, "Please enter email in correct format"],
    unique: true,
  },
  googleId:{
    type:String,
    min:6,
    max:255
},
  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: [6, "password should be atleast of 6 character"],
    select: false, //while calling user pass not present by default, call it explicitly
  },
  role: {
    type: String,
    default: "user",
  },

  photo: { //for photo 2 fields we get from  cloudinary
    id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },

  forgotPasswordToken: String,

  forgotPasswordExpiry: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

//include methods before exporting userSchema


// ----------------------------------------------------------------


//encrypt password before save --hook = lifecycle event (pre & post )
// userSchema.pre("save", async function(){})
// Document.prototype(" ", fun)
userSchema.pre("save", async function (next) {
  //if pass is not modified directlt go to next else encrypt it then go further
  if (!this.isModified("password")) {
    return next();
  }
  //else: if pass modified then encrypt it (10 rounds of bcrypt)
  this.password = await bcrypt.hash(this.password, 10);
});


// -------------------------------------------------------------------


//validate password with the password on user passed password
userSchema.methods.isValidatedPassword = async function (usersendpassword) {
  return await bcrypt.compare(usersendpassword, this.password);
};

// -------------------------------------------------------------------


//json web token method to create and return token 
//2methods==> .sign-->for creating token and .verify-->     
//jwt.sign({check _id (payload that y want to use to create token)}, secret, {expiry time})  //jwt.verify(token, secret)
//whenever you are saving data in db it will auto generates id field (bson fromat) (_id)

userSchema.methods.getJwtToken = function () {
  //return jwt.sign({check _id}, secret, {expiry time})
  return jwt.sign(
    {
      id: this._id,
    },
      process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );
};


// ---------------------------------------------------------------------

  

//generate forgot password token (just string)
userSchema.methods.getForgotPasswordToken = function () {
  //generate a random string --//some packages: NanoId, UUID, randomString, crypto(inside nodejs)
  const forgotToken = crypto.randomBytes(20).toString("hex");
  //we can assign this.forgotToken=forgotPasswordToken
  //or hash that random string to increase security
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)   
    .digest("hex");

  //in db we are storing this hash not forgotToken but we are sending that forgot token to user not hashed value
  //token that user sends that will be again hashed and then we will check it is same or not

  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

  return forgotToken;
};

// ---------------------------------------------------------------------



module.exports = mongoose.model("User", userSchema);
