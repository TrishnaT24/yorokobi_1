const express = require('express');
const mongoose = require('mongoose');
const restaurantRoutes = require('./routes/restaurantRoutes'); // Adjust path as needed
// const startQueueCleanup = require('./controllers/queueCleanupService');

const app = express();
// startQueueCleanup();
app.use(express.json());

const cors = require('cors');
const router = require('./routes/restaurantRoutes');
app.use(cors());
// Use the restaurant routes
app.use('/api/restaurants', restaurantRoutes);


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
