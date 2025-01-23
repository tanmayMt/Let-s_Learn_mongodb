const express = require('express'); // Import the Express framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB

const app = express(); // Initialize the Express application

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/mongodb_learn'; 
// Replace 'mongodb_learn' with your database name. Ensure MongoDB is running locally or modify the URI for a remote database.

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true, // Use the new MongoDB connection string parser
  useUnifiedTopology: true, // Use the new topology engine for monitoring the database
})
.then(() => console.log('MongoDB connected successfully')) // Log success message if connected
.catch((error) => console.error('Error connecting to MongoDB:', error)); // Log error message if connection fails

// Middleware and routes
app.use(express.json()); 
// Middleware to parse incoming JSON requests. Necessary for handling POST and PUT requests with JSON payloads.

// Define a schema
const userSchema = new mongoose.Schema({
  name: String, // Name of the user, stored as a string
  email: String, // Email of the user, stored as a string
  password: String, // Password of the user, stored as a string
});
// Schema defines the structure of documents in the 'users' collection in MongoDB.

// Create a model
const User = mongoose.model('User', userSchema); 
// The model binds the schema to a MongoDB collection (e.g., 'users') and provides an interface for database operations.

// Example: Add a new user
const newUser = new User({ 
  name: 'John Doe', // Sample name
  email: 'john.doe@example.com', // Sample email
  password: '123456', // Sample password
});
// Create a new user document based on the schema.

newUser.save() 
  .then(() => console.log('User saved to the database')) // Log success message when the user is saved
  .catch((error) => console.error('Error saving user:', error)); // Log error message if saving fails

app.get('/', (req, res) => {
  res.send('MongoDB connection with Mongoose is successful!');
});
// Define a route that sends a response confirming the connection. This is useful for testing the server status.

// Start the server
const PORT = 3000; // Define the port number for the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); 
});
// Start the Express server on the defined port and log the server URL.
