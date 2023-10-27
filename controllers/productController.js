const Product= require("../models/product");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cloudinary = require("cloudinary");
const WhereClause = require("../utils/whereClause");



//add products 
exports.addProduct =BigPromise(async(req,res,next)=>{
  let imageArray =[];
  if(!req.files){
     return next(new CustomError("Images are required", 401));
  }
//upload photos array on cloudinary
  if(req.files){
    for(let index=0; index<req.files.photos.length; index++){
      let result= await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath,{
        folder:"products"
      });
      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  req.body.photos = imageArray;
  req.body.user = req.user.id;

  const product= await Product.create(req.body);

  res.status(200).json({
    sucess:true,
    product,
  });

})
  

//get products
exports.getAllProducts =BigPromise(async(req,res,next)=>{

  const resultPerPage=6;
  const totalProductCount = await Product.countDocuments();//gives count of total products

// const products= Product.find({});
// WhereClause(base,bigquery) i.e (Product.find(), req.query)
  const productsObj =new WhereClause(Product.find(), req.query).search().filter();

  let products = await productsObj.base;

  const filteredProductCount = products.length;

  // products.limit().skip();

  productsObj.pager(resultPerPage);
  products= await productsObj.base.clone();
   
//we are throwing this json things in frontend
  res.status(200).json({
    sucess:true,
    products,
    filteredProductCount,
    totalProductCount
  })

})


//to get individual/single product by user
//after clicking on product by user get that prd id and find it in DB
//get one product - user route
exports.getOneProduct= BigPromise(async(req,res,next)=>{
  const product = await Product.findById(req.params.id);
  //if id is ont found raise err
  if(!product){
    return next(new CustomError("No product found with this id",401));
  }
  res.status(200).json({
    success:true,
    product
  })
})



//add review
exports.addReview= BigPromise(async(req,res,next)=>{
  //grab info from db
  const {rating, comment, productId}=req.body;
  //create review obj //this is our review
  const review={
    user: req.user._id,
    name:req.user.name,
    rating:Number(rating),
    comment
  }
  //push this in DB, but find prd in which we are going to push this one
  const product=await Product.findById(productId);

  const AlreadyReview = product.reviews.find(
    (rev)=>rev.user.toString()===req.user._id.toString()
  )

  if(AlreadyReview){
    //loop through array on each review run method - matched that particular ele with element in db that have this review 
    product.reviews.forEach((review)=>{
      if( review.user.toString()===req.user._id.toString() ){
        review.comment=comment,
        review.rating=rating
      }
    })

  }else{
    product.reviews.push(review);
    product.numberOfReviews=product.reviews.length
  }

  //adjust avg rating
  product.ratings=product.reviews.reduce((acc, item)=>item.rating + acc, 0) / product.reviews.length

  //save
  await product.save({validateBeforeSave:false})


  res.status(200).json({
    success:true,
  })

})



//adminGetAllProducts
exports.adminGetAllProducts= BigPromise(async(req,res,next)=>{
  const products= Product.find();  //grab all products from DB

  res.status(200).json({
    success: true,
    products
  });

})



//update product with photo
exports.adminUpdateOneProduct=BigPromise(async(req,res,next)=>{
//user will send id of prd and it is in param or in query
let product=await Product.findById(req.params.id);
let imageArray=[];

if(!product){
  return next(new CustomError("No product found with this id",401));
}

//if rq.files present (photos present) then 1st destroy old ones and add new & save them
if(req.files){
  //destroy pre ones
  for(let index=0; index<product.length; index++){
      const res=await cloudinary.v2.uploader.destroy(product.photos[index].id)
  }
  //upload new ones
  for(let index=0; index<req.files.photos.length; index++){
    let result= await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath,{
      folder:"products"
    });
    imageArray.push({
      id: result.public_id,
      secure_url: result.secure_url,
    });
  }
}

//now add that imageArray in req.body
req.body.photos=imageArray;

//images updation done, now update info
product=await Product.findByIdAndUpdate(req.params.id, req.body,{
  new: true,
  runValidators: true,
  useFindAndModify: false
})

res.status(200).json({
  success: true,
  product
});

})



//delete single product by admin
 exports.adminDeleteOneProduct=BigPromise(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
      return next(new CustomError("No product found with this id",401));
    }
    //destroy
    for(let index=0; index<product.length; index++){
      const res=await cloudinary.v2.uploader.destroy(product.photos[index].id)
  }
  //remove
  await product.remove();

res.status(200).json({
  success: true,
  message: "Product was deleted !"
});

 })



//
//delete review
 exports.deletereview= BigPromise(async(req,res,next)=>{
  //grab info from db
  const { productId}=req.query;
  
  //push this in DB, but find prd in which we are going to push this one
  const product=await Product.findById(productId);

  const reviews=product.reviews.filter(
    (rev)=> rev.user.toString() === req.user._id.toString()
  )

  const numberOfReviews=reviews.length

  //adjust avg rating
  product.ratings=product.reviews.reduce((acc, item)=>item.rating + acc, 0) / product.reviews.length

  //update
  await Product.findByIdAndUpdate(productId, {
    reviews,
    ratings,
    numberOfReviews
  },{
    new: true,
    runValidators: true,
  useFindAndModify: false
  })


  res.status(200).json({
    success:true,
  })

})


//get review for one product only
exports.getOnlyReviewsForOneProduct=BigPromise(async(req,res,next)=>{
  const product=await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews
  });
})