const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    
    ref: 'User'
  },
  category: {
    type: String,
    enum: [
      'Shirt', 'Pants', 'Shoes', 'Outerwear', 'Dresses', 'Skirts', 
      'Shorts', 'Sweaters', 'Jackets', 'Watch', 'Chain', 'Belt', 
      'Bag', 'Scarf', 'Hat', 'Gloves', 'Socks'
    ], 
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  usage: {
    type: Number,
    default: 0,
  },
  material: {
    type: String,
    enum: [
      'Organic Cotton', 
      'Recycled Polyester', 
      'Hemp', 
      'Linen', 
      'Bamboo', 
      'Conventional Cotton', 
      'Polyester', 
      'Nylon', 
      'Synthetic', 
      'Leather'
    ],
    required: true,
  },
  donated: {
    type: Boolean,
    default: false,
  },
  occasion: {
    type: [String],
    enum: ['Casual', 'Formal', 'Sports', 'Party', 'Work', 'Beach'],
    default: [],
  },
  season: {
    type: String,
    enum: ['Winter', 'Spring', 'Summer', 'Fall'],
    required: true,
  },
  image: {
    type: String,
   
  },
  sustainabilityPoints: {
    type: Number,
    default: 0,
  }
});

function calculateSustainabilityPoints(item) {
    let points = 0;

    const materialRatings = {
        'Organic Cotton': 5,
        'Recycled Polyester': 4,
        'Hemp': 5,
        'Linen': 4,
        'Bamboo': 4,
        'Conventional Cotton': 1,
        'Polyester': 0,
        'Nylon': 0,
        'Synthetic': -1,
        'Leather': -2
    };

    const material = item.material;
    if (materialRatings[material] !== undefined) {
        points += materialRatings[material];
    }

    if (item.usage > 15) {
        points += 5;
    } else if (item.usage > 5) {
        points += 3;
    } else if (item.usage > 0) {
        points += 1;
    }

    if (item.donated) {
        points += 8;
    }

    return points;
}

const WardrobeItem = mongoose.model('WardrobeItem', itemSchema);

module.exports = { WardrobeItem, calculateSustainabilityPoints };
