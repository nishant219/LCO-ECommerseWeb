const express=require("express");
const router=express.Router();
const {isLoggedIn, customRole} =require("../middlewares/user");

const {sendStripeKey, captureStripePayment, sendRazorpayKey, captureRazorpayPayment} =require("../controllers/paymentController");

router.route("/stripeKey").get(sendStripeKey);
router.route("/stripePayment").post(isLoggedIn, customRole("user"), captureStripePayment);
    
router.route("/razorpayKey").get(sendRazorpayKey);
router.route("/razorpayPayment").post(isLoggedIn, customRole("user"), captureRazorpayPayment);


module.exports=router;