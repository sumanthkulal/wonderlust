const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {email,username,password}=req.body;
        const newUser=new User({email,username})
        let registredUser=await User.register(newUser,password)
        // console.log(registredUser)
        req.login(registredUser,(err)=>{
            if(err)
            {
                return next(err)
            }
            req.flash("success","Welcome To WonderLust")
            res.redirect("/listings")
        })
        
    } catch(e)
    {
        req.flash("error",e.message)
        res.redirect("/signup");
    }
    
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})
// router.post("/login",saveRedirectUrl,passport.authenticate("local",
//     {failureRedirect:"/login",failureFlash:true}),
//     async(req,res)=>{ 
//         req.flash("success","Welcome back to Wonderlust");
//         let redirect=res.locals.redirectUrl || "/listings"
//         res.redirect(redirect)

//     }
// )

router.post("/login", saveRedirectUrl, passport.authenticate("local",
    { failureRedirect: "/login", failureFlash: true }),
    async (req, res) => {
        req.flash("success", "Welcome back to Wonderlust");

        let redirect = res.locals.redirectUrl || "/listings";

        // Check if the redirect URL contains "_method=DELETE"
        if (redirect.includes("_method=DELETE")) {
            // Extract the base listing URL (everything before "/reviews/")
            redirect = redirect.split("/reviews/")[0];
        }
        res.redirect(redirect);
    }
);


router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err)
        {
            return next(err)
        }
        req.flash("success","you are logged out")
        res.redirect("/listings");
    })
})

module.exports=router
