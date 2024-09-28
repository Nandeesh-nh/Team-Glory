const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js')
const passport=require("passport")
const {saveRedirectUrl} = require("../middleware.js");


router.get("/signup",(req, res)=>{
    res.render("./users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username ,email , password}=req.body;
        let newUser = new User({
            username,
            email
        });
        const registeredUser = await User.register(newUser , password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success" , "welcome to WanderLust");
            res.redirect("/");
        })
    }
    catch(e)
    {
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}))

router.get("/login",(req, res)=>{
    res.render("./users/login.ejs"); 
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",
    {
    failureRedirect:"/login", 
    failureFlash:true,
    }),async(req,res)=>{
        req.flash("success","Welcome back to WanderLust!");
        let redirectUrl = res.locals.redirectUrl || "/";
        res.redirect(redirectUrl);
})



router.get("/logout", (req,res)=>{
    req.logout((err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/");

    });

});

router.get('/dashboard', (req,res) => {

    const dashboardData = {
        totalItems: 15,
        mostUsedItem: { name: 'Blue Jeans', usageCount: 10 },
        leastUsedItem: { name: 'Red Jacket', usageCount: 1 },
        categoryBreakdown: {
          shirts: 5,
          pants: 4,
          shoes: 3,
          accessories: 2,
          outerwear: 1,
        },
        sustainabilityScore: 78, // Dummy sustainability score out of 100
      };
    
    res.render('../views/pages/dashboard.ejs', {data: dashboardData})
})

module.exports = router; 