const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {email,username,password}=req.body;
        const newUser=new User({email,username})
        let registredUser=await User.register(newUser,password)
        console.log(registredUser)
         req.flash("success","Welcome To WonderLust")
         res.redirect("/listings")
    } catch(e)
    {
        req.flash("error",e.message)
        res.redirect("/signup");
    }
    
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})
router.post("/login",passport.authenticate("local",
    {failureRedirect:"/login",failureFlash:true}),
    async(req,res)=>{
        req.flash("success","Welcome back to Wonderlust");
        res.redirect("/listings")

    }
)

module.exports=router
