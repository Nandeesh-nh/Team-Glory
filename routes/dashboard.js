const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const { WardrobeItem, calculateSustainabilityPoints } = require('../models/WardrobeItem');

router.get('/',isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have user info in req.user

    // Fetch user information
    const user = await User.findById(userId);

    // Fetch all wardrobe items for this user
    const items = await WardrobeItem.find({ userId: userId });

    // Calculate total items
    const totalItems = items.length;

    // Calculate category breakdown
    const categoryBreakdown = {};
    items.forEach(item => {
      categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + 1;
    });

    // Find most and least used items
    let mostUsedItem = { name: 'N/A', usage: 0 };
    let leastUsedItem = { name: 'N/A', usage: Infinity };
    items.forEach(item => {
      if (item.usage > mostUsedItem.usage) {
        mostUsedItem = { name: item.category, usage: item.usage };
      }
      if (item.usage < leastUsedItem.usage) {
        leastUsedItem = { name: item.category, usage: item.usage };
      }
    });

    // Calculate total sustainability points
    const totalSustainabilityScore = items.reduce((sum, item) => sum + calculateSustainabilityPoints(item), 0);
    const sustainabilityScore = totalItems > 0 ? (totalSustainabilityScore / totalItems).toFixed(2) : 0;

    // Prepare the data object
    const data = {
      user: {
        username: user.username,
        email: user.email
      },
      totalItems: totalItems,
      mostUsedItem: mostUsedItem,
      leastUsedItem: leastUsedItem,
      sustainabilityScore: sustainabilityScore,
      categoryBreakdown: categoryBreakdown,
    };

    // Render the EJS template with the data
    res.render('./pages/dashboard', { data: data });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
