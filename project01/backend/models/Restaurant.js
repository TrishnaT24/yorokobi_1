const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  country: { type: String, required: true },
  fullAddress: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  postalCode: { type: String, required: true },
  cuisines: { type: [String], required: true },
  id: { type: Number, unique: true, required: true },
  link: { type: String, required: true },
  menu: { type: String },
  name: { type: String, required: true },
  openStatus: { type: String },
  openStatusText: { type: String },
  photos: { type: [String] },
  priceTypes: { type: String },
  rating: { type: Number },
  reviewsCount: { type: Number },
  telephone: { type: String },
  thumbnail: { type: String },
  queue_size: { type: Number, default: 0 },
  names: { type: [String], default: [] },
  lastQueueUpdate: { type: Date, default: Date.now } // Added to track last queue update
}, { timestamps: true, versionKey: false });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;