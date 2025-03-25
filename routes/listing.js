const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError");
const {listingSchema,reviewSchema}=require("../schema.js")
const Listing=require("../models/listing.js");


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}


//Index Routes
router.get("/",wrapAsync(async (req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})); 

//new routes
router.get("/new",(req,res)=>{
        res.render("listings/new.ejs");
});

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing)
    {
    req.flash("error"," Listing you requested is does not exist")
    res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing});
}))


//create route
router.post("/", validateListing,wrapAsync(async (req,res,next)=>{
   

    let listing=req.body.listing;
    if (typeof listing.image === 'string') {
        listing.image = { filename: 'listingimage', url: listing.image };
    }
    const newListing=new Listing(listing);
    await newListing.save();
    req.flash("success","New Listing Created!")
    res.redirect("/listings");
}))

//Edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
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
router.put("/:id",validateListing,wrapAsync( async (req, res) => {
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
router.delete("/:id",wrapAsync(async (req,res)=>{
let {id}=req.params;
await Listing.findByIdAndDelete(id);
req.flash("success","Listing Deleted!")
res.redirect("/listings");
}))

module.exports=router;