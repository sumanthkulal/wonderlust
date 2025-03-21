const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const path=require("path");
const ejsMate=require("ejs-mate"); 
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError");
const {listingSchema}=require("./schema.js")


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
main().
then(()=>{
    console.log("conneected to DB");
})
.catch(()=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}
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

app.get("/listings",wrapAsync(async (req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})); 

app.get("/listings/new",(req,res)=>{
        res.render("listings/new.ejs");
});

app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}))

//create route
app.post("/listings", validateListing,wrapAsync(async (req,res,next)=>{
   

        let listing=req.body.listing;
        if (typeof listing.image === 'string') {
            listing.image = { filename: 'listingimage', url: listing.image };
        }
        const newListing=new Listing(listing);
        await newListing.save();
        res.redirect("/listings");
}))

app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))
// app.put("/listings/:id",async (req,res)=>{
//     let {id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${id}`);
// })
app.put("/listings/:id",validateListing,wrapAsync( async (req, res) => {

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

    // Redirect to the updated listing page
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

app.get("/",(req,res)=>{
    res.send("hi i am in root");
})
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong"}=err;
    res.status(statusCode).render("error.ejs",{message})
    // res.status(statusCode).send(message);
})
app.listen(8080,()=>{
    console.log("app listening at port 8080");
})


