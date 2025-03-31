const { model } = require("mongoose");
const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup=async(req,res)=>{
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
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login=async (req, res) => {
    req.flash("success", "Welcome back to Wonderlust");

    let redirect = res.locals.redirectUrl || "/listings";

    // Check if the redirect URL contains "_method=DELETE"
    if (redirect.includes("_method=DELETE")) {
        // Extract the base listing URL (everything before "/reviews/")
        redirect = redirect.split("/reviews/")[0];
    }
    res.redirect(redirect);
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err)
        {
            return next(err)
        }
        req.flash("success","you are logged out")
        res.redirect("/listings");
    })
}