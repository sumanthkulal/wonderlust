const Listing=require("./models/listing.js");
const ExpressError=require("./utils/ExpressError");
const {listingSchema,reviewSchema}=require("./schema.js")
const Review=require("./models/review.js");

module.exports.isLogedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
        {
            console.log(req.originalUrl)
            req.session.redirectUrl=req.originalUrl;
            console.log(req.session.redirectUrl)
            req.flash("error","you must be logged in to create listing")
            return res.redirect("/login")
        }
        console.log(" i am at isLoged")
        next()   
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    // res.locals.redirectUrl="/listings"
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl
        delete req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner=async (req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.curUser._id))
    {
        req.flash("error","You are not the Owner of the Listing")
       return res.redirect(`/listings/${id}`);
    }
    next()
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body); 
    if(error)
        {
            throw new ExpressError(400,error);
        }
        else{
            next();
        }
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params
    let review=await Review.findById(reviewId)
    console.log(review)
    console.log(review.author._id)
    console.log(res.locals.curUser._id)
    if(!review.author.equals(res.locals.curUser._id))
    {
        req.flash("error","You are not the author of the Review")
        return res.redirect(`/listings/${id}`);
    }
    next()
}