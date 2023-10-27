const express = require('express');
const app = express();
const BigPromise = require("../middlewares/bigPromise");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


exports.sendStripeKey=BigPromise(async(req, res, next)=>{

    res.status(200).json({
        stripePublishableKey: process.env.STRIPE_PUBLIC_KEY,
    })

}) 


exports.captureStripePayment=BigPromise(async(req, res, next)=>{
    const paymentIntent=await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',
        metadata:{integration_check: 'accept_a_payment'}
    })
    res.status(200).json({
        success: true,
        amount: req.body.amount,
        clientSecret: paymentIntent.client_secret,
    })
})



exports.sendRazorpayKey=BigPromise(async(req, res, next)=>{

    res.status(200).json({
        RazorpayPublishableKey: process.env.RAZORPAY_KEY_ID,
    })

}) 


exports.captureRazorpayPayment=BigPromise(async(req, res, next)=>{

    var instance = new Razorpay({ key_id:process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
    
    var options = {
        amount: req.body.amount,  
        currency: "INR",
        //receipt: "order_rcptid_11"
      };

      const myOrder=await instance.orders.create(options);

      res.status(200).json({
        success: true,
        amount: req.body.amount,
        order:myOrder
      })

    
})