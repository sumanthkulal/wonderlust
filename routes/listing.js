const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing.js");
const {isLogedIn,isOwner,validateListing}=require("../middleware.js")

//Index Routes
router.get("/",wrapAsync(async (req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})); 

//new routes
router.get("/new",isLogedIn,(req,res)=>{
    console.log(req.user)
    res.render("listings/new.ejs");
});

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate("reviews")
    .populate("owner");
    if(!listing)
    {
    req.flash("error"," Listing you requested is does not exist")
    res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing});
}))


//create route
router.post("/", isLogedIn,validateListing,wrapAsync(async (req,res,next)=>{
   

    let listing=req.body.listing;
    if (typeof listing.image === 'string') {
        listing.image = { filename: 'listingimage', url: listing.image };
    }
    const newListing=new Listing(listing);
    newListing.owner=req.user._id
    await newListing.save();
    req.flash("success","New Listing Created!")
    res.redirect("/listings");
}))

//Edit route
router.get("/:id/edit",isLogedIn,isOwner,wrapAsync(async (req,res)=>{
let {id}=req.params;
const listing=await Listing.findById(id);
if(!listing)
    {
    req.flash("error"," Listing you requested is does not exist")
    res.redirect("/listings")
    }
res.render("listings/edit.ejs",{listing});
}))

//Update Route
router.put("/:id",isLogedIn,isOwner,validateListing,wrapAsync( async (req, res) => {
    let { id } = req.params;
    let updatedListing = req.body.listing;
    // Ensure the image is in the correct format (object with filename and url)
    if (typeof updatedListing.image === 'string') {
    updatedListing.image = {
        filename: 'listingimage',  // Default filename or any specific filename you want
        url: updatedListing.image  // Image URL from the request body
    };
    }
    // Update the listing by ID with the updated data
    await Listing.findByIdAndUpdate(id, updatedListing);
    req.flash("success"," Listing updated")
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLogedIn,isOwner,wrapAsync(async (req,res)=>{
let {id}=req.params;
await Listing.findByIdAndDelete(id);
req.flash("success","Listing Deleted!")
res.redirect("/listings");
}))

module.exports=router;