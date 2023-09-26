const Reviews = require("../model/Review")
const Product =require("../model/Product")

const {checkPermission}= require("../utils")
const {StatusCodes}= require("http-status-codes")
const customApiError =  require("../errors")


const createReview = async(req, res)=>{
  const {product:productId} = req.body

  const isValidProduct = await Product.findOne({_id:productId})

  if(!isValidProduct){
    throw new customApiError.notFound(`No product with id: ${productId}`)
  }
  const alreadySubmitted = await Reviews.findOne({
    product: productId,
    user: req.user.userId
  })

  if(alreadySubmitted){
    throw new customApiError.BadRequestError(`Already submitted review for this product`)
  }

  req.body.user = req.user.userId
  const review = await Reviews.create(req.body)
res.status(StatusCodes.CREATED).json({review})
}

const getAllReviews = async(req, res)=>{
  const review = await Reviews.find({}).populate({path:"product", select:"name company price"});

  res.status(StatusCodes.OK).json({review, count:review.length})
     
}

const getReview = async(req, res)=>{
 const {id:reviewId} = req.params
 const review = await Reviews.findOne({_id:reviewId})
 
 if (!review) {
  throw new customApiError.notFound(`No review with id ${reviewId}`);
} jn 

 res.status(StatusCodes.OK).json({review, count:review.length})
}

const updateReview = async(req, res)=>{
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Reviews.findOne({ _id: reviewId });

  if (!review) {
    throw new customApiError.notFound(`No review with id ${reviewId}`);
  }

  checkPermission(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
}

const deleteReview = async(req, res)=>{
  const {id:reviewId} = req.params
  const review = await Reviews.findOne({_id:reviewId})
  if (!review) {
      throw new customApiError.notFound(`No review with id : ${reviewId}`);
    }

  checkPermission(req.user, review.user)

  await review.remove()
  
  res.status(StatusCodes.OK).json({ msg:`review with id : ${reviewId} deleted`})
}


const getProductReview = async(req, res)=>{
  const {id:productId} = req.params
  const isValidProduct = await Product.findOne({_id:productId})

  if(!isValidProduct){
    throw new customApiError.notFound(`No product with id: ${productId}`)
  }

  const review = await Reviews.find({product:productId})
  
  if (!review) {
    throw new customApiError.notFound(`No reviw review for product selected`);
  }

  res.status(StatusCodes.OK).json({review, count:review.length})
}





module.exports = {
    createReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview,
    getProductReview
}