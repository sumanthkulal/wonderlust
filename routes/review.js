const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview,isLogedIn,isReviewAuthor}=require("../middleware.js")

//review
router.post("/",isLogedIn,validateReview,wrapAsync(async(req,res)=>
{
    console.log(req.params.id)
    let listing=await Listing.findById(req.params.id)
    let newReview=new Review(req.body.review)
    newReview.author=req.user._id;
    await newReview.save();
   await listing.reviews.push(newReview)
    
    await listing.save();
    req.flash("success","New Review Created!")
    res.redirect(`/listings/${listing._id}`);
} ))

//delete review
router.delete("/:reviewId",isLogedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    // res.send("it WORKS")
    let {id,reviewId}=req.params
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Review Deleted")
    console.log("i am here")
    console.log(req.originalUrl)
    res.redirect(`/listings/${id}`);
}))

module.exports=router;

// /listings/67e56a762e3be30242daa748/reviews/67e6f7fe3601d73aadf3dafc?_method=DELETE
// /listings/67e5658c8c21f35ea0eb8d75/reviews/67e6e7986b170a900e327220?_method=DELETE