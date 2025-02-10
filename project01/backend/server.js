// const express = require('express');
// const mongoose = require('mongoose');
// const restaurantRoutes = require('./routes/restaurantRoutes'); // Adjust path as needed
// const app = express();

// app.use(express.json());

// const cors = require('cors');
// const router = require('./routes/restaurantRoutes');
// app.use(cors());
// // Use the restaurant routes
// app.use('/api/restaurants', restaurantRoutes);


// // Start server
// const PORT = 3000;
// app.listen(PORT, () => {a
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const restaurantRoutes = require('./routes/restaurantRoutes');
const startQueueCleanup = require('./controllers/queueCleanupService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
// mongoose.connect('mongodb://localhost:27017/restaurants', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log('Connected to MongoDB');
  startQueueCleanup();
// })
// .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/restaurants', restaurantRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;