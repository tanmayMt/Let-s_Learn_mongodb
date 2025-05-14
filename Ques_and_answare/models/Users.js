const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    name:{
        type:String,
        unique: true
    },
    email:{
        type:String,
        require:[true,"Email is require"],
        trim: true,
        lowercase
    }
})

// const users = mongoose.model("User",usersSchema);
export default  mongoose.model("User",usersSchema);


// users: {
//     "_id": ObjectId("8988998"),
//     "name": "Tanmay",
//     "email": "t@gmail.com"
//   }