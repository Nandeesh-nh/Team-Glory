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

// Search route, filtering by both userId and search query
router.get('/search', async (req, res) => {
  const searchQuery = req.query.query || ""; // Default to empty string if no query
  const userId = req.user._id;  // Assuming req.user contains the authenticated user's details

  try {
    // Retrieve all items for the user regardless of the search
    const noitem = await WardrobeItem.find({ userId: userId });

    // Perform the search by filtering based on userId and search query
    const wardrobeItems = await WardrobeItem.find({
      userId: userId,  // Match the user's ID
      $or: [
        { category: { $regex: searchQuery, $options: 'i' } },  // case-insensitive search
        { color: { $regex: searchQuery, $options: 'i' } },
        { material: { $regex: searchQuery, $options: 'i' } },
        { occasion: { $regex: searchQuery, $options: 'i' } },
        { season: { $regex: searchQuery, $options: 'i' } }
      ]
    });
    
    if (wardrobeItems.length === 0) {
      // No items found - set the flash message
      req.flash('error', 'No items found in your wardrobe.');
      
      return res.render('./pages/wardrobe.ejs', { 
        wardrobe: noitem 
      });
    }

    // Render the wardrobe page with the search results and all items
    req.flash("success","item found in your")
    res.render('./pages/wardrobe.ejs', { 
      wardrobe: wardrobeItems  
    });
  } catch (err) {
    console.error('Search Error:', err);
    req.flash('error', 'An error occurred while searching.');
    return res.render("./pages/404.ejs"); // Optionally render a 404 or error page
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
    req.flash("success","New item added");
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
      req.flash("success","Item removed");
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

  router.get('/donated', isLoggedIn, async (req, res) => {
    try {
      const donatedItems = await WardrobeItem.find({ donated: true }).populate('userId');
       // Fetch donated items with user email
       req.flash("success","donation added");
      res.render('./pages/donatedItems.ejs', { donatedItems }); // Render items in the view
    } catch (err) {
      res.status(500).send("Error fetching donated items");
    }
  });

module.exports = router;