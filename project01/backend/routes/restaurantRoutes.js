const express = require('express');
const router = express.Router();
const { saveRestaurantsToDB } = require('../controllers/restaurantController');
const Restaurant = require('../models/Restaurant');
const { login, signup } = require("../controllers/authController");
// Route to save restaurants
router.get('/fetch-restaurants', async (req, res) => {
  try {
    await saveRestaurantsToDB();
    res.status(200).send('Restaurants fetched and saved successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to fetch or save restaurants.');
  }
});

// Get all restaurants
router.get('/', async(req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch(error) {
    console.log('error fetching restaurants:', error);
    res.status(500).send('Failed to fetch restaurants from the database.');
  }
});
// Get single restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    res.json({
      success: true,
      restaurant
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant from the database.'
    });
  }
});

// POST route to update the rating of a restaurant
router.post('/submit-rating', async (req, res) => {
  const { restaurantID, rating } = req.body;

  if (!restaurantID || rating === undefined) {
    return res.status(400).json({
      success: false,
      message: "Missing data (restaurantID or rating)",
    });
  }

  try {
    const restaurant = await Restaurant.findOne({ _id: restaurantID });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
        providedId: restaurantID,
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5",
      });
    }

    const currentRating = restaurant.rating || 0;
    const currentReviewsCount = restaurant.reviewsCount || 0;

    const newAverageRating =
      (currentRating * currentReviewsCount + rating) /
      (currentReviewsCount + 1);

    restaurant.rating = newAverageRating;
    restaurant.reviewsCount = currentReviewsCount + 1;

    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: "Rating updated successfully!",
      averageRating: restaurant.rating,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update rating",
      error: error.message,
    });
  }
});
//login and signup requ
router.post("/login", login);  
router.post("/signup", signup); 

router.post('/update-queue', async (req, res) => {
  const { restaurantID, guests, name } = req.body;

  if (!restaurantID || guests === undefined || !name) {
    return res.status(400).json({
      success: false,
      message: "Missing data (restaurantID, guests, or name)",
    });
  }

  try {
    // Find the restaurant by ID and update it atomically
    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantID, 
      {
        $inc: { queue_size: guests }, // Increment queue size
        $push: { names: name } // Add name to names array
      }, 
      { new: true } // Return the updated document
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
        providedId: restaurantID,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Queue updated successfully!",
      newQueueSize: restaurant.queue_size,
      updatedNames: restaurant.names,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update queue",
      error: error.message,
    });
  }
});



module.exports = router;