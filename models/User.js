// User model definition using Mongoose
const mongoose = require('mongoose');

// Define the schema (structure) for a user
const userSchema = new mongoose.Schema({
  // Email address of the user (required field)
  email: { type: String, required: true },

  // Password of the user (required field)
  password: { type: String, required: true }
});

// Export the model so it can be used in other parts of the app
module.exports = mongoose.model('User', userSchema);
