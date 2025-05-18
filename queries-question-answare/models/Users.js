import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
    // userId:{
    //     type:mongoose.Schema.Types.ObjectId
    // },
    name:{
        type:String
    },
    email:{
        type:String,
        unique: true,
        require:[true,"Email is require"],
        trim: true,
        lowercase:true
    }
})

// const users = mongoose.model("User",usersSchema);
export default mongoose.model("Users",usersSchema);