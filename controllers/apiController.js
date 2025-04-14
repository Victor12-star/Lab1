// In-memory array to store items (temporary data store)
let items = [];

// Handle the base route: GET /
exports.index = (req, res) => {
  // Respond with a welcome message in JSON format
  res.json({ message: 'Welcome to the API!' });
};

// Handle GET /items
exports.getItems = (req, res) => {
  // Respond with the current list of items
  res.json(items);
};

// Handle POST /items
exports.createItem = (req, res) => {
  // Get the new item from the request body
  const newItem = req.body;

  // Add the new item to the in-memory array
  items.push(newItem);

  // Respond with the created item and a 201 Created status
  res.status(201).json(newItem);
};
