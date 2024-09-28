const express = require('express');
const router = express.Router();
const { WardrobeItem, calculateSustainabilityPoints } = require('../models/WardrobeItem');
const {saveRedirectUrl,isLoggedIn} = require("../middleware.js");
// GET /wardrobe - Render wardrobe items
router.get('/',isLoggedIn,async (req, res) => {
  try {
    const wardrobeItems = await WardrobeItem.find({ userId: req.user._id }); // Fetch all items for the logged-in user

    res.render('./pages/wardrobe.ejs', { wardrobe: wardrobeItems }); // Render items in the view
  } catch (err) {
    res.status(500).send("Error fetching wardrobe items");
  }
});

// POST /wardrobe/add-item - Add a new item
router.post('/add-item',isLoggedIn, async (req, res) => {
  const {category, color, usage, material, donated, occasion, season, image } = req.body;

  // Create a new wardrobe item
  const newItem = new WardrobeItem({
  
    category,
    color,
    usage,
    material,
    donated,
    occasion,
    season,
    image,
    sustainabilityPoints: calculateSustainabilityPoints({
      material,
      usage,
      donated
      
    })
  });
  newItem.userId = req.user._id;

  try {
    await newItem.save(); // Save to MongoDB

    res.redirect('/wardrobe'); // Redirect to the wardrobe view after adding
  } catch (err) {
    res.status(500).send("Error adding new item");
  }
});

router.post('/remove/:id', isLoggedIn, async (req, res) => {
    const itemId = req.params.id;
  
    try {
      // Find the item by ID and delete it
      await WardrobeItem.findByIdAndDelete(itemId);
      res.redirect('/wardrobe'); // Redirect to the wardrobe view after removing
    } catch (err) {
      res.status(500).send("Error removing item");
    }
  });
  
  router.post('/wear/:id', isLoggedIn, async (req, res) => {
    const itemId = req.params.id;
  
    try {
      // Find the item by ID and increment its usage count only if it belongs to the logged-in user
      await WardrobeItem.findOneAndUpdate(
        { _id: itemId, userId: req.user._id },
        { $inc: { usage: 1 } }
      );
      res.redirect('/wardrobe'); // Redirect to the wardrobe view after incrementing usage
    } catch (err) {
      res.status(500).send("Error updating usage count");
    }
  });
  router.post('/donate/:id', isLoggedIn, async (req, res) => {
    const itemId = req.params.id;
  
    try {
      // Find the item by ID and update its donated status only if it belongs to the logged-in user
      await WardrobeItem.findOneAndUpdate(
        { _id: itemId, userId: req.user._id },
        { donated: true }
      );
      res.redirect('/wardrobe'); // Redirect to the wardrobe view after donating
    } catch (err) {
      res.status(500).send("Error donating item");
    }
  });  

module.exports = router;