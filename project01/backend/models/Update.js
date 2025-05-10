const mongoose = require('mongoose');
const connectDB = require('../config/db'); // Adjust the path as needed
const Restaurant = require('./Restaurant'); // Adjust the path as needed

const updateQueueSizeField = async () => {
  await connectDB(); // Ensure the database is connected
  
  try {
    await Restaurant.updateMany(
      {}, // Select all documents
      { $set: { queue_size: 0 } } // Add the queue_size field with default value 0
    );
    console.log('queue_size field added to all documents.');
  } catch (err) {
    console.error('Error updating documents:', err.message);
  } finally {
    mongoose.connection.close(); // Close the connection after the update
  }
};

updateQueueSizeField();
