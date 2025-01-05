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

module.exports = router;
