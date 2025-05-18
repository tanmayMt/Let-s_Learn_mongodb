import mongoose from 'mongoose';

const ordersSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, ref: "User" 
    },
    amount:{
        type:Number,
        require:true
    },
    status:{
        type:String,
        require:true
    }
})

//const orders = mongoose.model("Orders",ordersSchema);
export default mongoose.model("Orders",ordersSchema);