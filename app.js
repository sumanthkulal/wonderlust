const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const path=require("path");
const ejsMate=require("ejs-mate"); 
const ExpressError=require("./utils/ExpressError");

const listingsRouter=require("./routes/listing.js")
const reviewsRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")

const session=require("express-session");
const flash=require("express-flash");

const passport=require("passport")
const LocalStatergy=require("passport-local")
const User=require("./models/user.js")


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
main().
then(()=>{
    console.log("Connected to DB");
})
.catch(()=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const sessionOptions={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized: true,
    cookie:{
            expires:Date.now()+7*24*60*60*1000,
            maxAge:7*24*60*60*1000,
            httpOnly:true,
    }
}

app.get("/",(req,res)=>{
    res.send("Welocome To Wonderlust");
})

app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize()) 
app.use(passport.session())
passport.use(new LocalStatergy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());   

app.use((req,res,next)=>{
    res.locals.success = req.flash("success") || [];
    res.locals.error = req.flash("error") || [];
    res.locals.curUser=req.user
    next()
})
app.use("/listings",listingsRouter)
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/",userRouter)


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


