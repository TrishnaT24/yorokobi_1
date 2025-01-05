
const Restaurant = require('../models/Restaurant');
const fetch = require('node-fetch');
const connectDB = require('../config/db'); // Adjust path as needed

const url = 'https://real-time-tripadvisor-scraper-api.p.rapidapi.com/tripadvisor_restaurants_search_v2?location=new%20york';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '4525b50511msh9baf97ab4562236p12c73bjsn2b1ce8d6c4cf',
    'x-rapidapi-host': 'real-time-tripadvisor-scraper-api.p.rapidapi.com'
  }
};

const saveRestaurantsToDB = async () => {
  try {
    // Ensure database connection is established first
    await connectDB();

    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok) {
      // If the response is not OK (e.g., 404 or 500), log the error
      console.error('Error fetching restaurant data:', response.statusText);
      return;
    }
    if (!result || !result.data) {
      console.log('No restaurants found in the API response.');
      return;
    }

    const operations = result.data.map(data => ({
      updateOne: {
        filter: { id: data.id },
        update: {
          $set: {
            country: data.address.country || [],
            fullAddress: data.address.fullAddress || '',
            latitude: data.address.latitude,
            longitude: data.address.longitude,
            postalCode: data.address.postalCode || '',
            cuisines: data.cuisines || [],
            id: data.id,
            link: data.link,
            menu: data.menu,
            name: data.name,
            openStatus: data.openStatus,
            openStatusText: data.openStatusText,
            photos: data.photos || [],
            priceTypes: data.priceTypes,
            rating: data.rating,
            reviewsCount: data.reviewsCount,
            telephone: data.telephone,
            thumbnail: data.thumbnail
          }
        },
        upsert: true
      }
    }));

    if (operations.length > 0) {
      const result = await Restaurant.bulkWrite(operations);
      console.log(`Restaurants saved to database successfully! Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);
    }
  } catch (error) {
    console.error('Error fetching or saving data:', error);
    throw error; // Re-throw to handle it in the calling code
  }
};

// Execute with error handling
const run = async () => {
  try {
    await saveRestaurantsToDB();
  } catch (error) {
    console.error('Failed to complete operation:', error);
    process.exit(1);
  }
};

run();





