// Filename: script.js

let userId = null; // Stores the currently logged-in user's ID
let editingRecipeId = null; // Stores the ID of the recipe being edited (if any)

async function registerUser() {
  // Get the email and password from the registration form
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  // Send a POST request to create a new user
  const res = await fetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }) // Send email and password as JSON
  });

  const user = await res.json(); // Parse the JSON response
  alert('User created!'); // Notify the user of successful registration
}

async function loginUser() {
  // Get the email entered for login
  const email = document.getElementById('loginEmail').value;

  // Fetch all users from the server
  const res = await fetch('/users');
  const users = await res.json(); // Parse the JSON response

  // Try to find a user with the entered email
  const user = users.find(u => u.email === email);
  if (!user) return alert('User not found.');

  userId = user._id; // Store the user ID
  alert('Logged in as ' + email); // Notify successful login

  // Show the UI sections that are hidden until login
  document.getElementById('recipeSection').style.display = 'block';
  document.getElementById('recipeSectionRight').style.display = 'block';
  document.getElementById('deleteUserSection').style.display = 'block';
}

async function addRecipe() {
  // Ensure the user is logged in
  if (!userId) return alert('Please log in first!');

  // Get values from the recipe form
  const title = document.getElementById('title').value;
  const ingredients = document.getElementById('ingredients').value.split(','); // Convert to array
  const instructions = document.getElementById('instructions').value;

  const data = { title, ingredients, instructions, userId }; // Build recipe object

  if (editingRecipeId) {
    // If editing an existing recipe, send a PUT request
    const res = await fetch(`/recipes/${editingRecipeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert('Recipe updated!');
      editingRecipeId = null; // Reset editing state
      document.getElementById('formTitle').innerText = 'Add Recipe'; // Reset form title
    }
  } else {
    // If creating a new recipe, send a POST request
    const res = await fetch('/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    alert('Recipe saved!');
  }

  clearForm(); // Reset the form fields
  fetchRecipes(); // Refresh the recipe list
}

function clearForm() {
  // Reset all input fields in the form
  document.getElementById('title').value = '';
  document.getElementById('ingredients').value = '';
  document.getElementById('instructions').value = '';
}

async function fetchRecipes() {
  // Ensure the user is logged in
  if (!userId) return alert('Please log in first!');

  // Fetch recipes for the current user
  const res = await fetch(`/recipes/${userId}`);
  const recipes = await res.json(); // Parse the JSON response

  const tableBody = document.querySelector('#recipeTable tbody');
  tableBody.innerHTML = ''; // Clear the current table contents

  // Loop through each recipe and add a row to the table
  recipes.forEach(recipe => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${recipe.title}</td>
      <td>${recipe.ingredients.join(', ')}</td>
      <td>${recipe.instructions}</td>
      <td>
        <button class="edit-button" onclick="editRecipe('${recipe._id}', '${recipe.title}', '${recipe.ingredients.join(', ')}', \`${recipe.instructions.replace(/`/g, '\\`')}\`)">✏️</button>
        <button class="delete-button" onclick="deleteRecipe('${recipe._id}')">🗑️</button>
      </td>
    `;
    tableBody.appendChild(row); // Add the row to the table
  });
}

function editRecipe(id, title, ingredients, instructions) {
  // Set editing state with selected recipe values
  editingRecipeId = id;
  document.getElementById('formTitle').innerText = 'Edit Recipe';
  document.getElementById('title').value = title;
  document.getElementById('ingredients').value = ingredients;
  document.getElementById('instructions').value = instructions;
}

async function deleteRecipe(recipeId) {
  // Confirm with the user before deleting
  const confirmed = confirm('Are you sure you want to delete this recipe?');
  if (!confirmed) return;

  // Send DELETE request to server
  const res = await fetch(`/recipes/${recipeId}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    alert('Recipe deleted!');
    fetchRecipes(); // Refresh the recipe list
  } else {
    alert('Could not delete the recipe.');
  }
}

async function deleteUser() {
  // Confirm with the user before deleting account
  const confirmed = confirm('Are you sure you want to delete your account and all your recipes?');
  if (!confirmed) return;

  // Send DELETE request to remove user
  const res = await fetch(`/users/${userId}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    alert('User deleted.');
    userId = null; // Clear user session

    // Hide all recipe-related sections
    document.getElementById('recipeSection').style.display = 'none';
    document.getElementById('recipeSectionRight').style.display = 'none';
    document.getElementById('deleteUserSection').style.display = 'none';
  } else {
    alert('Could not delete user.');
  }
}
