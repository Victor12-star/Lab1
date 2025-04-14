// Recipe model definition using Mongoose
const mongoose = require('mongoose');

// Define the schema (structure) for a recipe
const recipeSchema = new mongoose.Schema({
  // The title of the recipe
  title: String,

  // An array of ingredients (as strings)
  ingredients: [String],

  // The cooking instructions
  instructions: String,

  // Reference to the user who created the recipe (foreign key)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Export the model so it can be used in other parts of the app
module.exports = mongoose.model('Recipe', recipeSchema);
