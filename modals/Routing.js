const mongoose = require('mongoose')
const RouteSchema = new mongoose.Schema(
    {
        from:String,
        to:String,
        bus:String,
        amount:Number,
    }
)
const RouteModel = mongoose.model("Routes",RouteSchema)
module.exports = RouteModel;