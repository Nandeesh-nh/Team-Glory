const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js')
const passport=require("passport")
const {saveRedirectUrl,isLoggedIn} = require("../middleware.js");


router.get('/',isLoggedIn, (req,res) => {
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
        user: {username: req.user.username, email: req.user.email, userId: req.user._id},
        sustainabilityScore: 78,
         // Dummy sustainability score out of 100
      };
    
    res.render('../views/pages/dashboard.ejs', {data: dashboardData})
})
module.exports  = router;