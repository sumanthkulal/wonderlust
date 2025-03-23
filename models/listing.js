const mongoose=require("mongoose");
const review = require("./review");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { listingSchema } = require("../schema");

const ListingSchema=new Schema({
    title:String,
    description:String,
    image: {
        type: Object, // Change from String to Object
        default: {
            filename: 'listingimage',
            url: "https://images.unsplash.com/photo-1702744227929-356d993d81a0?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
            type:Schema.Types.ObjectId,
            ref:"Review"
    }]
})

ListingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing)
    {
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})
const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;
