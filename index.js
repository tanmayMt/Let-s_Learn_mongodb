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
// validation when creating schema

// - [official documentation](https://mongoosejs.com/docs/validation.html)
// - A common gotcha for beginners is that the unique option for schemas is not a validator.
// - Numbers have: min, max validators
// - Strings have: minlength, maxlength, trim, lowercase, enum
// - validator error message can be provided using array syntax and object syntax

// ```js
// Array syntax: min: [6, 'Must be at least 6, got {VALUE}']
// Object syntax: enum: { values: ['Coffee', 'Tea'], message: '{VALUE} is not supported' }

// Mongoose Custom validations

// - for fulfilling own requirements based on certain situation we need to create custom validations.
// - read about email vliadation
// - [create your own validation regular expression](https://regexr.com/3e48o)

// price:{
//     type: String,
//     required: [true, "title is required"],
//     validate: {
//       validator: function (v) {
//         return v.length === 10;
//       },
//       message: (props) => `${props.value} is not a valid product title!`,
//     },
// },
// phone: {
//     type: String,
//     required: [true, 'User phone number required'],
//     validate: {
//       validator: function(v) {
//         return /\d{3}-\d{3}-\d{4}/.test(v);
//       },
//       message: props => `${props.value} is not a valid phone number!`
//     },
//   }
//   email:{
//     // ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
//     type: String,
//     required: [true, 'User email is required'],
//     trim: true,
//     lowercase: true,
//     unique: true,
//     validate: {
//       validator: function(v) {
//         const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//         return emailRegex.test(v);
//       },
//       message: props => `${props.value} is not a valid phone number!`
//     },
//      email: {
//         type: String,
//         trim: true,
//         lowercase: true,
//         unique: true,
//         required: 'Email address is required',
//         validate: [validateEmail, 'Please fill a valid email address'],
//         match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
//     }

// npm validator

// - `npm i validator`

// ```js
// email: {
//     type: String,
//     unique: true,
//     required: [true, "email is required"],
//     trim: true,
//     lowercase: true,
//     validate: {
//       validator: validator.isEmail,
//       message: (props) => `${props.value} is not a valid email!`,
//     },
//   },

// pagination

// ```js
// const { page = 1, limit = 10 } = req.query;
// const products = await Product.find()
//   .limit(limit)
//   .skip((page - 1) * limit);
// console.log(products);

const productSchema = new mongoose.Schema({    // Define a schema
  title: {
    type: String,
    // validation
    required: [true, "product title is required"],//This is used in Mongoose to ensure that a specific field must have a value and cannot be left empty when creating or updating a document.

    minlength: 3, 
    minlength: [3, "error message here"],    
    maxlength: 20, 
   
    // lowercase: true,  // Converts the value to lowercase before saving it to the database.Useful for case-insensitive fields like emails.
    // uppercase: true,  // Converts the value to uppercase before saving. Useful for fields like codes or IDs that require consistent formatting.

    trim: true, // "     iphone 7      "
    // enum: ["iphone", "samsung", "motorola"] // no other value is allowed other than these,
    enum: {
      values: ['iphone', 'samsung', 'motorola'], // no other value is allowed other than these,
      message: '{VALUE} is not supported'
    }
  },
  description: {
    type: String,
    reuired: true,
  },
  price: {
    type: Number,
     required: true,
     min: 20,
     max: 30
  },
  rating: {
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
      title: "Realme",
      description: "a nice product",
      price: 1300,
    });
    const newProduct2 = new Product({
      title: "Lanovo",
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
    // Check if any products are found
    if (products.length>0) {// Check if the `products` array is empty
      // If products are found, send a success response with a 201 status
      res.status(201).send({
        success: true,                  // Indicates the request was successful
        message: "return all products", // Descriptive message for the response
        data: products,                 // Include the retrieved product data
      });
    } else {
      // If no products are found, send a 404 Not Found response
      res.status(404).send({
        success: false,                 // Indicates the request failed
        message: "Products Not Found!!" // Descriptive message for the failure
      });
    }
  } catch (error) {
    // Catch any error that occurs while fetching products from the database
    // Send a 500 Internal Server Error response along with the error message
    res.status(500).send({ message: error.message });
  }
});

// Route handler for GET request to Fetch the product based on the "id" provided in the URL parameter
http://localhost:3002/product/6795b15bbed6dd86bdba1b91
app.get("/product/:id", async (req, res) => {     
  console.log(`/product/${req.params.id}`)
  try {
    // Fetch the product based on the "id" provided in the URL parameter
    // If "id" is provided in the request parameters, it will filter products based on that
    const product1 = await Product.find({ _id: req.params.id });
                                      //Ensure that the id field in your database is actually called id. If your database schema uses _id (which is common in MongoDB), update the quer
    // Find a single product that matches the given _id (returns one document).
    // Use this w33hen you expect only one result or need a single document.                                  
    const product = await Product.findOne({ _id: req.params.id });

    // Send the retrieved product as a response
    // Check if any products are found
    if (product) {   // Ensure the `product` variable is not null or undefined. `product` is not a array
      // If products are found, send a success response with a 201 status
      res.status(200).send({
        success: true,                  // Indicates the request was successful
        message: "return single product", // Descriptive message for the response
        data: product,                 // Include the retrieved product data
      });
    } else {
      // If no products are found, send a 404 Not Found response
      res.status(404).send({
        success: false,                 // Indicates the request failed
        message: "Product is not Found!!" // Descriptive message for the failure
      });
    }
  } catch (error) { // Catch any error that occurs while fetching products from the database
    // Handle errors and send an internal server error response
    res.status(500).send({ message: error.message });
  }
});

// Define an API endpoint to fetch spacific field "title" of a product by its ID http://localhost:3002/product/title/6795b15bbed6dd86bdba1b91
app.get("/product/title/:id", async (req, res) => {     
  console.log(`/product/${req.params.id}`);
//If req.params.id is not a valid MongoDB ObjectId (it's an invalid format or has an incorrect length).
//When MongoDB's Mongoose library tries to cast the invalid value to an ObjectId, it throws a CastError because the value doesn't meet the requirements of a valid ObjectId.
    // Validate the `req.params.id` to ensure it's a valid MongoDB ObjectId
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
      return res.status(400).send({
        success: false,
        message: "Invalid Product ID", // Error message for invalid ObjectId
      });
    }

  try {
    // Find a single product by its `_id` field and retrieve only the `title` field
    // Use `.select({ title: 1 })` to include only the `title` field in the response                                  
    const productTitle = await Product.findOne({ _id: req.params.id })
                                       .select({title:1,_id:0});
                                        // `{ title: 1 }` means include the `title` field in the result
                                                  // `{ _id: 0 }` means exclude the `_id` field from the result

    // Send the retrieved product(s) as a response
    // Check if any products are found
    if (productTitle) {   // Ensure the `product` variable is not null or undefined. `product` is not a array
      // If products are found, send a success response with a 201 status
      res.status(200).send({
        success: true,                  // Indicates the request was successful
        message: "return single product", // Descriptive message for the response
        data: productTitle,                 // Include the retrieved product data
      });
    } else {
      // If no products are found, send a 404 Not Found response
      res.status(404).send({
        success: false,                 // Indicates the request failed
        message: "Product is not Found!!" // Descriptive message for the failure
      });
    }
  } catch (error) { // Catch any error that occurs while fetching products from the database
    // Handle errors and send an internal server error response
    res.status(500).send({ message: error.message });
  }
});

// Route handler for GET request to "/getAllProducts"
// Comparsion query operators
app.get("/getAllProducts", async (req, res) => {
  console.log(`/getAllProducts`);
  try {
    // Extracting the price from the query parameters
    //http://localhost:3002/getAllProducts?price=1300
    const price=req.query.price;
    console.log(price);
    // Fetch all products from the database where the price is exactly equal to the given value
    const products = await Product.find({price:{$eq:price}});

    const products1 = await Product.find({ price: 900 });
    const productsin = await Product.find({ price: { $in: [1200, 1300] } });
    const productsnin = await Product.find({ price: { $nin: [1200, 1300] } });
    const productsne = await Product.find({ price: { $ne: 1200 } });
    const productsgt = await Product.find({ price: { $gt: 1200 } });
    const productslt = await Product.find({ price: { $lt: 1200 } });
    const productsgte = await Product.find({ price: { $gte: 1200 } });

    // Check if any products are found
    if (products.length>0) {// Check if the `products` array is empty
      res.status(201).send({
        success: true,                  
        message: "return all products(/getAllProducts)", 
        data: products,
      });
    } else {
      // If no products are found, send a 404 Not Found response
      res.status(404).send({
        success: false,                 
        message: "Products Not Found!!" 
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Route handler for GET request to "/getAllProductsalogical"
// Query Operators: Logical operators
// $and, $or, $not, $nor    Example:   {$and : [{},{}]}
app.get("/getAllProductsalogical", async (req, res) => {
  console.log(`/getAllProductsalogical`);
  try {
    // Extracting the price from the query parameters
    //http://localhost:3002/getAllProductsalogical?price=1300&rating=4
    const price=req.query.price;
    const rating= req.query.rating;

    console.log(price);
    console.log(rating);
  // Fetch all products from the database where:
  // 1. The price is exactly equal to the given value
  // 2. The rating is greater than or equal to the given value
    const products = await Product.find({$and:[
      {price:{$eq:price}},{rating:{$gte:rating}}
    ]
    });

    //More Logical operators
const productsand = await Product.find({
  $and: [{ price: { $lt: 1400 } }, { rating: { $gt: 4 } }],
});

const productsor = await Product.find({
  $or: [{ price: { $lt: 1400 } }, { rating: { $gt: 4 } }],
});

// returns all that fail both clauses
const productsnor = await Product.find({
  $nor: [{ price: { $lt: 1400 } }, { rating: { $gt: 4 } }],
});

// $not
const productsnot = await Product.find({ price: { $not: { $lt: 900 } } });

    // Check if any products are found
    if (products.length>0) {// Check if the `products` array is empty
      res.status(201).send({
        success: true,                  
        message: "return all products(/getAllProducts)", 
        data: products,
      });
    } else {
      // If no products are found, send a 404 Not Found response
      res.status(404).send({
        success: false,                 
        message: "Products Not Found!!" 
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Route handler for GET request to "/getProductsCount" to get the count of all products  http://localhost:3002//getProductsCount
// counting and sorting :  countDocuments() / count()
app.get("/getProductsCount", async (req, res) => {
  // Log the endpoint being hit for debugging purposes
  console.log(`/getProductsCount`);
  try {
    // Fetch the total count of products from the database
    // `Product.find()` retrieves all products, and `.countDocuments()` counts the number of documents
    const noOfProducts = await Product.find().countDocuments();
    const notOfProductsWithPrice900 = await Product.find({price:{$eq:900}}).countDocuments();
    // Send the product count as a success response
    res.status(201).send({
      success: true,                  
      message: "return no of products(/getProductsCount)",
      data: {noOfProducts,notOfProductsWithPrice900},
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});


// Route handler for GET request to "/getProductsSort" to retrieve sorted products
// Endpoint: http://localhost:3002/getProductsSort
app.get("/getProductsSort", async (req, res) => {
  console.log(`/getProductsSort`);
  try {
    // Fetch all products from the database and sort them in ascending order based on the "price" field
    // `{ price: 1 }` indicates sorting in ascending order
    const sortedProducts = await Product.find().sort({price:1});   // 1 -> ascending
    
    // Fetch all products from the database and sort them in descending order based on the "price" field
    // `{ price: -1 }` indicates sorting in descending order
    const productsDes = await Product.find().sort({ price: -1 });  // -1 -> ascending

// sort and select
    const sortedproductstitle = await Product.find().sort({ title: 1 })
                                         .select({ title: 1, _id: 0 });
    console.log(sortedproductstitle);

   // Send the sorted products (ascending order) as a success response
    res.status(201).send({
      success: true,                  
      message: "return no of products(/getProductsSort)",
      data: sortedProducts,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

// Route handler for DELETE request to delete a product by its ID
// http://localhost:3002/product/67963aea78ea21d41d38881b
app.delete("/product/:id",async(req,res)=>{
  try{
    // Extract the product ID from the request parameters
    const id = req.params.id;

    // Delete the product with the matching ID from the database
    // `findByIdAndDelete()` finds a document by its `_id` and deletes it
    // Returns the deleted document if found and deleted, otherwise returns `null
    const deletedProduct = await Product.findByIdAndDelete({_id:id});

    // Check if the product was successfully deleted (affected document count > 0)
    // if (deletedProduct.deletedCount > 0) {
    if (deletedProduct) {
      // If the product was deleted, send a success response
      res.status(200).send({
        success: true,                    
        message: "Product is deleted successfully", 
        data: deletedProduct,    // Include the deleted product data in the response         
      });
    } else {
      // If no product was found with the given ID, send a 404 Not Found response
      res.status(404).send({
        success: false,     
        message: "Product not found(Deletion is not possiable)",
      });
    }
  }
  catch(error){
    res.status(500).send({
      message:error.message,
    });
  }
})

// Route handler for UPDATE request to update a product by its ID
// http://localhost:3002/product/6796e853a87cf547177e9e25
app.put("/product/:id",async(req,res)=>{
  try{
    // Extract the product ID from the request parameters
    const id = req.params.id;

    // Use Mongoose's findByIdAndUpdate to update the product by its ID
    const updatedProduct = await Product.findByIdAndUpdate(
                                                           {_id:id},// Query to find the product by its ID
                                                           {$set:{  // Fields to update in the product document
                                                                  title: req.body.title,  // Update the title field
                                                                  description: req.body.description,
                                                                  price: req.body.price,
                                                                  rating:req.body.rating
                                                                 }
                                                           },
                                                           { new: true } // Return the updated product in the response
                                                           //`{ new: true }` ensures that the updated product is returned in the response after the update operation, instead of the original (pre-update) document.
                                                          );

    if (updatedProduct) {
      // If the product was deleted, send a success response
      res.status(200).send({
        success: true,                    
        message: "Product is updated successfully", 
        data: updatedProduct,    // Include the updated product data in the response         
      });
    } else {
      // If no product was found with the given ID, send a 404 Not Found response
      res.status(404).send({
        success: false,     
        message: "Product not found(Deletion is not possiable)",
      });
    }
  }
  catch(error){
    res.status(500).send({
      message:error.message,
    });
  }
})


//Route Not Found
app.use((req,res)=>{
    res.status(404).json({message:"Route Not Fount"});
})

// Start the server
app.listen(port, async () => {
  console.log(`server is running at http://localhost:${port}`);
  await connectDB();
});