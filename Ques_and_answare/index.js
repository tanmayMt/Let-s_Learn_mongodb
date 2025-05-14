const express = require("express");
const mongoose = require("mongoose"); // Import Mongoose for MongoDB
const Users= require("./models/Users");
const Orders=require("./models/Orders");
const PORT = 3002;
const app = express();

const mongoURI = "mongodb://localhost:27017/query_ques_ans";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB: "+error);
  }
};

// Use middleware
app.use(express.json()); // Middleware to parse incoming JSON requests. Necessary for handling POST and PUT requests with JSON payloads.
app.use(express.urlencoded({ extended: true }));// Middleware to parse URL-encoded form data. This middleware is necessary to handle incoming form data from HTML forms (application/x-www-form-urlencoded).

//Fetch all orders with status "shipped"
app.get("/orders/shipped",async(req,res)=>{
  const shippedOrders = await Orders.find({status:'shipped'})
  

})

app.listen(PORT, () => {
    console.log(`🚀 Server is Running at http://localhost:${PORT}`);
});
