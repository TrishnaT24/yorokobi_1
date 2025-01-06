const express = require('express');
const router = express.Router();
const { saveRestaurantsToDB } = require('../controllers/restaurantController');
const Restaurant=require('../models/Restaurant');


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

router.get('/restaurants',async(req,res)=>{
try{
  const restaurants=await Restaurant.find();
  res.status(200);
  res.json(restaurants);

}catch(error)
{
  console.log('error fetching restaurants:',error);
  res.status(500).send('Failed to fetch restaurants from the database.');
}
});

router.get('/restaurants/:id', async (req, res) => {
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

  // Validate input
  if (!restaurantID || rating === undefined) {
    return res.status(400).json({
      success: false,
      message: "Missing data (restaurantID or rating)",
    });
  }

  try {
    // Find the restaurant by ID
    const restaurant = await Restaurant.findOne({ _id: restaurantID });

    // If restaurant is not found, return a 404 error
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
        providedId: restaurantID,
      });
    }

    // Check if the rating is a valid number between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5",
      });
    }

    // Update the restaurant's rating and reviewsCount
    const currentRating = restaurant.rating || 0;
    const currentReviewsCount = restaurant.reviewsCount || 0;

    // Calculate the new average rating
    const newAverageRating =
      (currentRating * currentReviewsCount + rating) /
      (currentReviewsCount + 1);

    // Update only the existing fields
    restaurant.rating = newAverageRating;
    restaurant.reviewsCount = currentReviewsCount + 1;

    // Save the updated document
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



module.exports = router;
