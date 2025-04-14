// User routes
const express = require('express');
const router = express.Router(); // Create a new router instance
const User = require('../models/User'); // Import the User model
const Recipe = require('../models/Recipe'); // Import the Recipe model

// Create a new user
router.post('/', async (req, res) => {
  // Create a user using the request body
  const user = await User.create(req.body);
  // Respond with the created user
  res.json(user);
});

// Get all users
router.get('/', async (req, res) => {
  // Find all users in the database
  const users = await User.find();
  // Respond with the list of users
  res.json(users);
});

// Delete a user and all their recipes
router.delete('/:id', async (req, res) => {
  try {
    // Delete the user by ID
    await User.findByIdAndDelete(req.params.id);

    // Delete all recipes associated with this user
    await Recipe.deleteMany({ userId: req.params.id });

    // Send success with no content
    res.sendStatus(204);
  } catch (err) {
    // Handle any errors
    res.status(500).json({ error: 'Something went wrong while deleting the user.' });
  }
});

// Export the router to be used in server.js
module.exports = router;
