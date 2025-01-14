const mongoose = require('mongoose');

// Define the schema
const restaurantSchema = new mongoose.Schema({
  country: { type: String, required: true },
  fullAddress: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  postalCode: { type: String, required: true },
  cuisines: { type: [String], required: true }, // Array of cuisines
  id: { type: Number, unique: true, required: true }, // Ensure id is unique
  link: { type: String, required: true },
  menu: { type: String },
  name: { type: String, required: true },
  openStatus: { type: String },
  openStatusText: { type: String },
  photos: { type: [String] }, // Array of photo URLs
  priceTypes: { type: String },
  rating: { type: Number },
  reviewsCount: { type: Number },
  telephone: { type: String },
  thumbnail: { type: String },
  queue_size: { type: Number, default: 0 }
}, { timestamps: true,versionKey: false }); // Adds createdAt and updatedAt fields

// Create the model
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
