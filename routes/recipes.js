// Routes for recipes
const express = require('express');
const router = express.Router(); // Create a new router instance
const Recipe = require('../models/Recipe'); // Import the Recipe model

// Create a new recipe
router.post('/', async (req, res) => {
  // Create a new recipe using data from the request body
  const recipe = await Recipe.create(req.body);
  // Respond with the created recipe
  res.json(recipe);
});

// Get all recipes for a specific user
router.get('/:userId', async (req, res) => {
  // Find recipes that belong to the given user ID
  const recipes = await Recipe.find({ userId: req.params.userId });
  // Respond with the list of recipes
  res.json(recipes);
});

// Delete a specific recipe by ID
router.delete('/:id', async (req, res) => {
  try {
    // Delete the recipe by its ID
    await Recipe.findByIdAndDelete(req.params.id);
    // Respond with no content (success)
    res.sendStatus(204);
  } catch (err) {
    // Respond with error if deletion fails
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

// Export the router so it can be used in server.js
module.exports = router;
