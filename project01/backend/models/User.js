const mongoose=require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true, // Ensures the username is unique
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true, // Converts to lowercase before saving
      match: [/.+@.+\..+/, 'Please enter a valid email address'], // Simple email regex
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\d{10}$/, 'Phone number must be 10 digits'], // Ensures a valid 10-digit number
    },
  }
);

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;
