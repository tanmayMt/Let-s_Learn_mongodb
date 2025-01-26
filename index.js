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

// Route handler for GET request to "/products"  ->Creating a new Product document
app.post("/products", async (req, res) => {
  try {
    // // Creating a new Product document using the request body
    // const newProduct = new Product({
    //   title: req.body.title,       // Product title from the request body
    //   price: req.body.price,       // Product price from the request body
    //   description: req.body.description, // Product description from the request body
    // });

    // // Saving the newly created Product to the database
    // const productData = await newProduct.save(); // Add a new product to the database

    // // Sending the saved Product data as the response with a 201 Created status
    // res.status(201).send(productData);

    // Create multiple document
    const newProduct1 = new Product({
      title: "iPhone 16",
      description: "a nice product",
      price: 1300,
    });
    const newProduct2 = new Product({
      title: "iPhone 17",
      description: "a nice cute product",
      price: 1990,
    });
    const productData = await Product.insertMany([newProduct1,newProduct2]);
    // console.log(productData);
    // Sending the saved Product data as the response with a 201 Created status
    res.status(201).send(productData);
  } catch (error) {
    // Handling errors and sending a 500 Internal Server Error response
    res.status(500).send({ message: error.message }); // Send error message if save fails
  }
});

// Route handler for GET request to "/products"
app.get("/products", async (req, res) => {
  console.log(`/products`);
  try {
    // Fetch all products from the database
    const products = await Product.find();
    
    // // Fetch a limited number of products (2) from the database
    // const products1 = await Product.find().limit(2);

    // Send the retrieved products as a response with status code 201 (Created)
    res.status(201).send(products);
  } catch (error) {
    // Catch any error that occurs while fetching products from the database
    // Send a 500 Internal Server Error response along with the error message
    res.status(500).send({ message: error.message });
  }
});

// Route handler for GET request to Fetch the product based on the "id" provided in the URL parameter
//http://localhost:3002/product/67946cc81c0fc2fd32d9aa67
app.get("/product/:id", async (req, res) => {     
  console.log(`/product/${req.params.id}`)
  try {
    // Fetch the product based on the "id" provided in the URL parameter
    // If "id" is provided in the request parameters, it will filter products based on that
    const product = await Product.find({ _id: req.params.id });
                                      //Ensure that the id field in your database is actually called id. If your database schema uses _id (which is common in MongoDB), update the quer
    // Find a single product that matches the given _id (returns one document).
    // Use this when you expect only one result or need a single document.                                  
    const product1 = await Product.findOne({ _id: req.params.id });

    // Send the retrieved product(s) as a response
    res.status(200).send(product);
  } catch (error) { // Catch any error that occurs while fetching products from the database
    // Handle errors and send an internal server error response
    res.status(500).send({ message: error.message });
  }
});

// Define an API endpoint to fetch spacific field "title" of a product by its ID//http://localhost:3002/product/title/67946cc81c0fc2fd32d9aa67
app.get("/product/title/:id", async (req, res) => {     
  console.log(`/product/${req.params.id}`)
  try {
    // Find a single product by its `_id` field and retrieve only the `title` field
    // Use `.select({ title: 1 })` to include only the `title` field in the response                                  
    const productTitle = await Product.findOne({ _id: req.params.id }).select({title:1});

    // Send the retrieved product(s) as a response
    res.status(200).send(productTitle);
  } catch (error) { // Catch any error that occurs while fetching products from the database
    // Handle errors and send an internal server error response
    res.status(500).send({ message: error.message });
  }
});

//Route Not Found
app.use((req,res)=>{
    res.status(404).json({message:"Route Not Fount"});
})

// Start the server
app.listen(port, async () => {
  console.log(`server is running at http://localhost:${port}`);
  await connectDB();
});