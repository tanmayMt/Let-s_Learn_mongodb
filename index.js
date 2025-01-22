const express = require("express");

const port = 3002;
const app = express();

// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/shop");
//     console.log("db is connected");
//   } catch (error) {
//     console.log(error);
//   }
// };

app.listen(port, async () => {
  console.log(`server is running at http://localhost:${port}`);
  //await connectDB();
});