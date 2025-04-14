// server.js

// Load environment variables from .env file
require('dotenv').config();

// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Create an Express application
const app = express();

// Enable parsing of JSON data in request bodies
app.use(express.json());

// Enable Cross-Origin Resource Sharing (for frontend/backend communication)
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Import database models
const User = require('./models/User');
const Recipe = require('./models/Recipe');

// ========================
//    CONNECT TO MONGODB
// ========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ Connection error:', err));

// ========================
//          ROUTES
// ========================

// 🧍 Create a new user
app.post('/users', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Create a new user document
    const user = new User({ email, password });
    await user.save(); // Save to database
    res.status(201).json(user); // Respond with the created user
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// 🔎 Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.json(users); // Return the list as JSON
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
});

// 🗑 Delete a user and all their recipes
app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete user by ID
    await User.findByIdAndDelete(userId);

    // Also delete all recipes created by that user
    await Recipe.deleteMany({ userId });

    res.sendStatus(204); // No content response
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

// 🍽 Create a new recipe
app.post('/recipes', async (req, res) => {
  const { title, ingredients, instructions, userId } = req.body;

  try {
    // Create new recipe document
    const recipe = new Recipe({ title, ingredients, instructions, userId });
    await recipe.save(); // Save to database
    res.status(201).json(recipe); // Respond with the created recipe
  } catch (err) {
    res.status(500).json({ error: 'Failed to create recipe.' });
  }
});

// 📋 Get all recipes for a specific user
app.get('/recipes/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const recipes = await Recipe.find({ userId }); // Find all recipes by user ID
    res.json(recipes); // Return as JSON
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve recipes.' });
  }
});

// ✏️ Update a recipe
app.put('/recipes/:id', async (req, res) => {
  const { title, ingredients, instructions } = req.body;

  try {
    // Update recipe by ID and return the updated document
    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title, ingredients, instructions },
      { new: true } // Return the updated document
    );

    if (!updated) return res.status(404).json({ error: 'Recipe not found.' });

    res.json(updated); // Respond with the updated recipe
  } catch (err) {
    res.status(500).json({ error: 'Failed to update recipe.' });
  }
});

// 🗑 Delete a recipe
app.delete('/recipes/:id', async (req, res) => {
  try {
    // Delete recipe by ID
    await Recipe.findByIdAndDelete(req.params.id);
    res.sendStatus(204); // No content
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete recipe.' });
  }
});

// ========================
//       START SERVER
// ========================
const PORT = process.env.PORT || 3000; // Use environment port or default to 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
