const { model } = require("mongoose")
const Listing=require("../models/listing")
const Review=require("../models/review")
module.exports.createReview=async(req,res)=>
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
    }

module.exports.destroyReview=async(req,res)=>{
    // res.send("it WORKS")
    let {id,reviewId}=req.params
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Review Deleted")
    console.log("i am here")
    console.log(req.originalUrl)
    res.redirect(`/listings/${id}`);
}