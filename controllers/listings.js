const Listing=require("../models/listing")
module.exports.index=async (req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    console.log(req.user)
    res.render("listings/new.ejs");
}

module.exports.showListings=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    }) 
    .populate("owner");
    if(!listing)
    {
    req.flash("error"," Listing you requested is does not exist")
    res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing=async (req,res,next)=>{
    
        console.log(req.body.listing.location);

       


    let url=req.file.path;
    let filename=req.file.filename;
    let listing=req.body.listing;
   
    const newListing=new Listing(listing);
    newListing.owner=req.user._id
    newListing.image={url,filename}

    let sl=await newListing.save();
   
    req.flash("success","New Listing Created!")
    res.redirect("/listings");
}

module.exports.renderEditForm=async (req,res)=>{
let {id}=req.params;
const listing=await Listing.findById(id);
if(!listing)
    {
    req.flash("error"," Listing you requested is does not exist")
    res.redirect("/listings")
    }
    let OIU = listing.image.url;
        OIU = OIU.replace("/upload", "/upload/h_300");
    // https://res.cloudinary.com/demo/image/upload/ar_1.0,c_fill,h_250/bo_5px_solid_lightblue/leather_bag_gray.jpg

res.render("listings/edit.ejs",{listing,OIU});
}

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let updatedListing = req.body.listing;
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename; 
    updatedListing.image = { url,filename };
    }
    await Listing.findByIdAndUpdate(id, updatedListing);
    req.flash("success"," Listing updated")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
    }