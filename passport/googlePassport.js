const passport = require('passport');;
const User=require("../models/user");

var GoogleStrategy = require('passport-google-oauth20').Strategy;

//Its 2 way communication, we send data to google and google send data to us
// We send data to google in the form of clientID, clientSecret and callbackURL  
// Google send data to us in the form of accessToken, refreshToken, profile and next

passport.serializeUser((user, next)=>{
    next(null, user.id); // This user.id is the id that is created by mongoDB
})

passport.deserializeUser((id, next)=>{
    User.findById(id)
    .then(user=>{
        next(null, user);
    })
})


passport.use(new GoogleStrategy(
    {
    clientID: process.env.Client_ID,
    clientSecret: process.env.Client_Secret,
    callbackURL: "http://localhost:4000/auth/google/callback",
},

(accessToken, refreshToken, profile, next)=>{
    console.log(profile._json.email);  // This is the data that we get from google, grab user email from it
    User.findOne({email:profile._json.email})
    .then(user=>{
        if(user){
            console.log(" User already exists:  ", user);
            next(null, user); // If user already exists, then pass the user to the next middleware
        }else{
            User.create({
                name:profile.displayName,
                email:profile._json.email,
                googleId:profile.id
            }).then(
                user=>{
                    console.log("User created", user);
                    next(null, user);
                }
            ).catch(err=>{
                console.log(err);
            })
        }
    })
}   

) );