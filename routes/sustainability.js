const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js')
const passport=require("passport")
const {saveRedirectUrl} = require("../middleware.js");

router.get('/sustainability', (req,res) => {
    res.render('../views/pages/sustainability.ejs')
})

module.exports = router;