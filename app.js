require("dotenv").config();

const express =  require('express')
const app = express();
const ejsMate= require('ejs-mate'); 
const methodOverride=require('method-override');
const path = require('path')
const mongoose= require('mongoose');
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const User = require("./models/user");
const flash =require("connect-flash");

const userRouter=require("./routes/user.js")

const ExpressError=require('./utils/ExpressError.js')

app.set('view engine' , 'ejs');
app.set("views", path.join(__dirname , "views"));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const dbURL = process.env.ATLASDB_URL 

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60, //1 day
});
store.on("error",()=>{
    console.log("Error in mongo session store"); 
})

const sessionOptions ={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};

main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err); 
}) 

async function main(){
    await mongoose.connect(dbURL);
}

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get("/" , (req,res)=>{
    res.render("./pages/home.ejs")
})
app.use("/",userRouter);

app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="async function error"}=err;
    console.log(err);
    res.status(statusCode).render("./pages/error.ejs",{message});
    
    // res.status(statusCode).send(message);
})

app.listen(8080,()=>{ 
    console.log("listening to port 8080");
}); 