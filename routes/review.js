const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview,isLogedIn,isReviewAuthor}=require("../middleware.js")
const reviewController=require("../controllers/reviews.js")

// create review
router.post("/",isLogedIn,validateReview,wrapAsync(reviewController.createReview))

//delete review
router.delete("/:reviewId",isLogedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports=router;