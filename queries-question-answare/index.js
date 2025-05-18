import express from "express";
import mongoose from "mongoose";
import Users from "./models/Users.js";
import Orders from "./models/Orders.js";

const PORT = 3002;
const app = express();


const mongoURI = "mongodb+srv://tanmaychamat:6SzOi5IHxbfVHQTd@cluster0.cbzksif.mongodb.net/query_ques_ans";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB: "+error);
  }
};

connectDB();

// Use middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.get("/",async(req,res)=>{
  res.send("<h1>Welcome to Mongodb</h1>")
})

//Fetch all orders with status "shipped"
//http://localhost:3002/admin/orders/shipped
app.get("/admin/orders/shipped",async(req,res)=>{
  const shippedOrders = await Orders.find(
    {status:"shipped"}
  );
  res.status(200).json({
    success:true,
    data:shippedOrders
  })
  //db.orders.find({ status: "shipped" });
})

// Total amount spent by each user (aggregation)
// http://localhost:3002/admin/users/amount
app.get("/admin/users/amount", async (req, res) => {
  try {
    const userTotals = await Orders.aggregate([
      {
        // Group orders by userId and calculate total amount spent by each user
        $group: {
          _id: "$userId",                   // Group by the userId field in each Order document
          totalSpent: { $sum: "$amount" }   // Sum the 'amount' field to get total spent per user
        }
      },
      {
        // Perform a lookup (JOIN) with the Users collection to fetch user details
        $lookup: {
          from: "users",            // Collection to join with (must match collection name in MongoDB, usually lowercase plural)
          localField: "_id",        // Field from the grouped result (userId)
          foreignField: "_id",      // Field from the Users collection (user's _id)
          as: "userInfo"            // Output array field to store the matched user document
        }
      },
      {
        // Flatten the userInfo array (because $lookup always returns an array)
        $unwind: "$userInfo"        // Convert the userInfo array to a flat object so we can access fields directly
      },
      {
        // Project (select) the desired fields for the final output
        $project: {
          _id: 0,                         // Exclude the default _id field from the output
          userId: "$_id",                 // Rename grouped _id to userId
          name: "$userInfo.name",         // Include name from the userInfo object
          email: "$userInfo.email",       // Include email from the userInfo object
          totalSpent: 1                   // Include totalSpent field as-is (1 means include it)
        }
      }
      ]
    );
    
    res.status(200).json({
      success: true,
      data: userTotals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user totals",
      error: error.message
    });
  }
});

// 3. Users with total orders > ₹1000
// Total amount spent by each user greater than 10000 (aggregation)
// http://localhost:3002/admin/users/amount_graterThan
app.get("/admin/users/amount_graterThan", async (req, res) => {
  try {
    const userTotals = await Orders.aggregate([
      {
        // Group orders by userId and calculate total amount spent by each user
        $group: {
          _id: "$userId",                   // Group by userId
          totalSpent: { $sum: "$amount" }   // Calculate total spent per user
        }
      },
      {
        // Filter users whose totalSpent is greater than 1000
        $match: {
          totalSpent: { $gt: 1000 }
        }
      },
      {
        // Join with Users collection to fetch user details
        $lookup: {
          from: "users",              // collection name (MongoDB uses lowercase plural by default)
          localField: "_id",          // userId from grouped orders
          foreignField: "_id",        // user _id from Users collection
          as: "userInfo"              // output field
        }
      },
      {
        // Flatten the joined userInfo array
        $unwind: "$userInfo"
      },
      {
        // Format the final output
        $project: {
          _id: 0,                         // remove internal _id
          userId: "$_id",                 // rename _id to userId
          name: "$userInfo.name",         // include user name
          email: "$userInfo.email",       // include user email
          totalSpent: 1                   // include totalSpent as-is
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: userTotals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user totals",
      error: error.message
    });
  }
});


// 4. Create index on status and check stats
// db.orders.createIndex({ status: 1 });
// db.orders.find({ status: "shipped" }).explain("executionStats");
// http://localhost:3002/admin/orders/index-status
app.get("/admin/orders/index-status", async (req, res) => {
  try {
    await Orders.createIndex({ status: 1 }); // create index on status
    const stats = await Orders.find({ status: "shipped" }).explain("executionStats"); // check stats
    res.status(200).json({
      success: true,
      message: "Index created and execution stats fetched successfully",
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create index or fetch stats",
      error: error.message
    });
  }
});


// 5. Update all "pending" orders to "confirmed"
// db.orders.updateMany(
// { status: "pending" },
// { $set: { status: "confirmed" } }
// );

// http://localhost:3002/admin/orders/confirm
app.put("/admin/orders/confirm", async (req, res) => {
  try {
    const result = await Orders.updateMany(
      {status:"pending"},
      {$set: {status:"confirmed"}}
    )
    // const result = await Orders.updateMany(
    //   { status: "pending" },
    //   { $set: { status: "confirmed" } }
    // );
    res.status(200).json({
      success: true,
      message: "Pending orders updated to confirmed",
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update orders",
      error: error.message
    });
  }
});

// 6. Add new order inside a user document (embedding)
// db.users.updateOne(
// { name: "Tanmay" },
// { $push: { orders: { amount: 800, status: "shipped" } } }
// );
// Embed an order inside a user document using $push
// http://localhost:3002/admin/users/add-embedded-order
app.put("/admin/users/add-embedded-order", async (req, res) => {
  try {

    const result = await Users.updateOne(
      {name:"Tanmay"},
      {$push: {orders: {amount: 9999,status:"shipped"}}}
    )
    // const result = await Users.updateOne(
    //   { name: "Tanmay" },
    //   { $push: { orders: { amount: 800, status: "shipped" } } } // adds order to embedded array
    // );

    res.status(200).json({
      success: true,
      message: "Order added inside user document",
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add order inside user document",
      error: error.message
    });
  }
});

// POST: Add new order (referenced, not embedded)
// http://localhost:3002/admin/orders/add
app.post("/admin/orders/add", async (req, res) => {
  try {
    const { userId, amount, status } = req.body;

    // Create a new order with reference to the user
    const newOrder = new Orders({
      userId,   // referenced user ID
      amount,
      status
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created and linked to user",
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
});

// ✅ 7. Fetch orders with user names using $lookup
// db.orders.aggregate([
//   {
//   $lookup: {
//   from: "users",
//   localField: "user_id",
//   foreignField: "_id",
//   as: "user_info"
//   }
//   },
//   {
//   $unwind: "$user_info"
//   },
//   {
//   $project: {
//   amount: 1,
//   status: 1,
//   user_name: "$user_info.name"
//   }
//   }
//   ]);
// Perform JOIN to fetch orders with user name
// http://localhost:3002/admin/orders/with-user
app.get("/admin/orders/with-user", async (req, res) => {
  try {
    // Aggregation Framework or pipeline to join data from two collections.
    const result = await Orders.aggregate([
      {
        $lookup:  //	Join orders with users via userId
        {
          from: "users",        // Collection to join
          localField: "userId", // Field in Orders
          foreignField: "_id",  // Field in Users
          // This joins each Orders document with its corresponding Users document  
          // by matching Orders.userId to Users._id.
          as: "user_info"       // Output array field
        }
      },
      //Since $lookup creates an array, we "flatten" it using $unwind to directly access its fields.
      { $unwind: "$user_info" }, // Flatten user_info array
      //After this stage, each order has a direct user_info object instead of an array.
      {
        $project: {
        //Select and rename output fields
          amount: 1,
          status: 1,
          user_name: "$user_info.name"
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders with user info",
      error: error.message
    });
  }
});

//✅ 8. Count orders per status
// Group orders by status and count each group
// http://localhost:3002/admin/orders/status-count
app.get("/admin/orders/status-count", async (req, res) => {
  try {
    const statusCount = await Orders.aggregate([
      {
        $group: {
          _id: "$status",          // Group by 'status'
          count: { $sum: 1 }       // Count documents in each group
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: statusCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to count orders by status",
      error: error.message
    });
  }
});



// app.post("/users/bulk", async (req, res) => {
//   try {
//     const users = [
//       { "name": "Bijoy", "email": "tanmay587d.com" },
//       { "name": "Sami", "email": "samhi@example.com" }
//     ];
//     const result = await Users.insertMany(users);
//     res.status(201).json({
//       success: true,
//       message: "Users added successfully",
//       data: result
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to add users",
//       error: error.message
//     });
//   }
// });

// app.post("/orders/bulk", async (req, res) => {
//   try {
//     const orders = [
//       { "userId": "682538d710fb7b1a2603ab81", "amount": 1000, "status": "shipped" },
//       { "userId": "682538d710fb7b1a2603ab82", "amount": 500, "status": "pending" }
//     ]; // expecting array of orders
//     const result = await Orders.insertMany(orders);
//     res.status(201).json({
//       success: true,
//       message: "Orders added successfully",
//       data: result
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to add orders",
//       error: error.message
//     });
//   }
// });
//
// 
//x


//
app.get("/admin/users/all",async(req,res)=>{  //http://localhost:3002/admin/users/all
  try {
    const users = await Users.find();
    res.status(200).json({
      success:true,
      data:users,
      message:"All User are returend Successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get all users",
      error: error.message
    })
  }
})

// GET all orders
// http://localhost:3002/admin/orders/all
app.get("/admin/orders/all", async (req, res) => {
  try {
    const allOrders = await Orders.find({}); // Fetch all documents from 'orders' collection
    res.status(200).json({
      success: true,
      data: allOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
});



app.listen(PORT, () => {
    console.log(`🚀 Server is Running at http://localhost:${PORT}`);
});
