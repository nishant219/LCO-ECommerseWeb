const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide product name"],
    trim: true,
    maxlength: [120, "name should not exceed 120 char"],
  },

  price: {
    type: Number,
    required: [true, "please provide product price"],
    maxlength: [8, "price should not be more than 8 digits"],
  },

  description: {
    type: String,
    required: [true, "please provide product description"],
  },

  //photos not obj its array so we can loop through it
  //photos :[{},{},{}]
  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],
  
  category: {
    type: String,
    required: [
      true,
      "please select of product category from-  shortsleeves, longsleeves, sweatshirts, hoodies",
    ],
    enum: {
      values: ["shortsleeves", "longsleeves", "sweatshirt", "hoodies"],
      message: "please select category only from above options",
    },
  },

  brand: {
    type: String,
    required: [true, "Please add a brand for clothing"],
  },
  
  ratings: {
    type: Number,
    default: 0,
  },

  numberOfReviews: {
    type: Number,
    default: 0,
  },


  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name:{
        type: String,
        required: true,
      },
      rating:{
        type: Number,
        required: true,
      },
      comment:{
        type: String,
        required: true,
      },

    }
  ],

  user:{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt:{
    type: Date,
    default: Date.now,
  },

});


module.exports = mongoose.model("Product", productSchema);
