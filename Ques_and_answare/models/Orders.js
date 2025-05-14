const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, ref: "User" 
    },
    amount:{
        type:Number,
        require
    },
    status:{
        type:String,
        require
    }
})

//const orders = mongoose.model("Orders",ordersSchema);
export default mongoose.model("Orders",ordersSchema);


// orders: {
//     "_id": 1,
//     "user_id": ObjectId("8886876"),
//     "amount": 500,
//     "status": "shipped"
//   }