const express = require("express");
// Node.js and mongodb connection  *2 ways to connect -> with mongoose package, with mongodb package
// method 1: with mongodb package
//    install mongodb : `npm i mongodb`
// method 2: with mongoose package
//     mongoose in an ODM (Object data modeling) Library for MongoDB and node.js. It provides schema validation. node.js -> mongoose -> mongo driver -> mongoDB
const mongoose = require("mongoose");

const port = 3002;
const app = express();

//mongodb connection
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mongodb_learn");
    console.log("mongodb is connected");
  } catch (error) {
    console.log(error);
  }
};

// Mongoose schema & model
// - define structure of document with validation
// - we can define default values of a field
// - A model works as a wrapper for schema. It provides an interface for accessign database to create, update, delete, read from database.
const productSchema = new mongoose.Schema({
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
const Product = mongoose.model("Products", productSchema);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.send("<h1>Welcome To Products Page</h1>");
});

app.post("/products",async(req,res)=>{
  try{
    const newProduct = new Product({
      title:req.body.title,
      price:req.body.price,
      description:req.body.description
    })
    const productData = await newProduct.save();

    res.status(201).send(productData);
  }
  catch(error){
    res.status(500).send({message:error.message});
  }
});

app.listen(port, async () => {
  console.log(`server is running at http://localhost:${port}`);
  await connectDB();
});