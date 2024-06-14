const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema(
    {
        name:String,
        email:String,
        password:String,
        roll:String,
        year:Number,
        role:String,
        phone:Number,
        bus:String,
        boarding:String

    }
)

const UserModel = mongoose.model("Users",UserSchema)

module.exports = UserModel;
