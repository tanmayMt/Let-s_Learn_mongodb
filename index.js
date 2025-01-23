const express = require("express");
// Node.js and mongodb connection  *2 ways to connect -> with mongoose package, with mongodb package
// method 1: with mongodb package
//    install mongodb : `npm i mongodb`
// method 2: with mongoose package
//     mongoose in an ODM (Object data modeling) Library for MongoDB and node.js. It provides schema validation. node.js -> mongoose -> mongo driver -> mongoDB
const mongoose = require("mongoose"); // Import Mongoose for MongoDB

const port = 3002;
const app = express();

// Connect to MongoDB
// MongoDB connection URI
const mongoURI = "mongodb://localhost:27017/mongodb_learn"; // 'mongodb_learn' is the database name
// Replace 'mongodb_learn' with your database name. Ensure MongoDB is running locally or modify the URI for a remote database
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB: "+error);
  }
};

// Mongoose schema & model
// - define structure of document with validation
// - we can define default values of a field
// - A model works as a wrapper for schema. It provides an interface for accessign database to create, update, delete, read from database.
const productSchema = new mongoose.Schema({    // Define a schema
  title: {
    type: String,
    reuired: true,
  },
  description: {
    type: String,
    reuired: true,
  },
  price: {
    type: Number,
    reuired: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Product = mongoose.model("Products", productSchema); // Create a model

// Middleware and routes
app.use(express.json()); // Middleware to parse incoming JSON requests. Necessary for handling POST and PUT requests with JSON payloads.
app.use(express.urlencoded({ extended: true }));// Middleware to parse URL-encoded form data. This middleware is necessary to handle incoming form data from HTML forms (application/x-www-form-urlencoded).

app.get("/",(req,res)=>{
    res.send("<h1>Welcome To Products Page</h1>");
});

app.post("/products", async (req, res) => {
  try {
    // Creating a new Product document using the request body
    const newProduct = new Product({
      title: req.body.title,       // Product title from the request body
      price: req.body.price,       // Product price from the request body
      description: req.body.description, // Product description from the request body
    });

    // Saving the newly created Product to the database
    const productData = await newProduct.save(); // Add a new product to the database

    // Sending the saved Product data as the response with a 201 Created status
    res.status(201).send(productData);
  } catch (error) {
    // Handling errors and sending a 500 Internal Server Error response
    res.status(500).send({ message: error.message }); // Send error message if save fails
  }
});


// Start the server
app.listen(port, async () => {
  console.log(`server is running at http://localhost:${port}`);
  await connectDB();
});