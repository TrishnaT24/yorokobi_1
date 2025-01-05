
// const mongoose = require('mongoose');
// require('dotenv').config();

// const mongo_url = process.env.MONGO_URL;

// const connectDB = async (retryCount = 5) => {
//   try {
//     const options = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       connectTimeoutMS: 30000, // 30 seconds connection timeout
//       serverSelectionTimeoutMS: 30000, // Timeout for selecting a MongoDB server
//       socketTimeoutMS: 45000, // Timeout for socket operations
//     };

//     // Attempt to connect
//     await mongoose.connect(mongo_url, options);
//     console.log('MongoDB Connected...');
//   } catch (err) {
//     console.error('MongoDB Connection Error:', err.message);

//     // Retry logic with limited attempts
//     if (retryCount > 0) {
//       console.log(`Retrying MongoDB connection... (${retryCount} attempts left)`);
//       setTimeout(() => connectDB(retryCount - 1), 5000); // Retry after 5 seconds
//     } else {
//       console.error('Max retries reached. Exiting...');
//       process.exit(1); // Exit the process if all retries fail
//     }
//   }
// };

// // Enable debug mode
// mongoose.set('debug', true);

// module.exports = connectDB;









const mongoose = require('mongoose');
require('dotenv').config();

const mongo_url = process.env.MONGO_URL;

const connectDB = async (retryCount = 5) => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongo_url, options);
    console.log('MongoDB Connected...');
    return true; // Return true on successful connection
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);

    if (retryCount > 0) {
      console.log(`Retrying MongoDB connection... (${retryCount} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      return connectDB(retryCount - 1);
    } else {
      console.error('Max retries reached. Exiting...');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
