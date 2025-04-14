// Import Express framework
const express = require('express');

// Create a new router instance
const router = express.Router();

// Import the controller that handles the logic for each route
const apiController = require('../controllers/apiController');

// Route: GET /
// Description: Handle base route with a general index method
router.get('/', apiController.index);

// Route: GET /items
// Description: Fetch a list of items
router.get('/items', apiController.getItems);

// Route: POST /items
// Description: Create a new item
router.post('/items', apiController.createItem);

// Export the router to be used in server setup
module.exports = router;
