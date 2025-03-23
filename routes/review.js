const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError");
const {reviewSchema}=require("../schema.js")
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
  


const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body); 
    if(error)
        {
            throw new ExpressError(400,error);
        }
        else{
            next();
        }
}

//review
router.post("/",validateReview,wrapAsync(async(req,res)=>
{
    console.log(req.params.id)
    let listing=await Listing.findById(req.params.id)
    let newReview=new Review(req.body.review)
    await newReview.save();
   await listing.reviews.push(newReview)
    
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
} ))

//delete review
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    // res.send("it WORKS")
    let {id,reviewId}=req.params
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`);
}))

module.exports=router;