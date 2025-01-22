const express = require("express");
// Node.js and mongodb connection  *2 ways to connect -> with mongoose package, with mongodb package
// method 1: with mongodb package
//    install mongodb : `npm i mongodb`
// method 2: with mongoose package
//     mongoose in an ODM (Object data modeling) Library for MongoDB and node.js. It provides schema validation. node.js -> mongoose -> mongo driver -> mongoDB
const mongoose = require("mongoose");

const port = 3002;
const app = express();


const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mongodb_learn");
    console.log("mongodb is connected");
  } catch (error) {
    console.log(error);
  }
};


app.listen(port, async () => {
  console.log(`server is running at http://localhost:${port}`);
  await connectDB();
});