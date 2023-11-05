const express = require("express");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middlewares/user");
const passport=require("passport");

router.get("/google",
  passport.authenticate("google",{scope:[], failureRedirect: "/login" }),
  (req,res)=>{
    res.send("login with google");
  }
)

router.get("/google/callback", passport.authenticate('google'),    
(req,res)=>{
    res.send(req.user);
})

const {
  signup,
  login,
  logout,
  forgotPassword,
  passwordReset,
  getLoggedInUserDetails,
  changePassword,
  updateUserDetails,
  adminAllUser,
  managerAllUser,
  adminGetOneUser,
  adminUpdateOneUser,
  adminDeleteOneUser
} = require("../controllers/userController");



//router.route().method(functionality that route going to perform)

router.route("/signup").post(signup);  
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails); //middleware enjected for token
router.route("/password/update").post( isLoggedIn ,changePassword);
router.route("/userdashboard/update").post( isLoggedIn ,updateUserDetails);


//admin and managers routes
router.route("/admin/users").get( isLoggedIn, customRole('admin') ,adminAllUser);
router.route("/admin/user/:id").get( isLoggedIn, customRole('admin') ,adminGetOneUser).put(isLoggedIn, customRole("admin"), adminUpdateOneUser ).delete(isLoggedIn, customRole("admin"),adminDeleteOneUser);

router.route("/manager/users").get( isLoggedIn, customRole('manager') ,managerAllUser);
 

module.exports = router;

