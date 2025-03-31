// const { title } = require("process")

const Joi=require("joi")

module.exports.listingSchema=Joi.object(
    {
        listing:Joi.object({ 
            title:Joi.string().required(),
            description:Joi.string().required(),
            location:Joi.string().required(), 
            country:Joi.string().required(),
            // price:Joi.string().required().min(0),
            // image:Joi.required()
            price: Joi.number().required().min(0),  // ✅ Fixed price validation
            image: Joi.object({  // ✅ Expecting image as an object
                url: Joi.string().uri().optional(),
                filename: Joi.string().optional()
            }).optional()
        }).required() 
    }
)
module.exports.reviewSchema=Joi.object(
    {
        review:Joi.object({
            rating:Joi.number().required().max(5).min(0),
            comment:Joi.string().required(),

        }).required()
    }
)