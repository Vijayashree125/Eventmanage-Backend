const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    name: { type: String, default: "admin" },
    loginStatus:{type:String},
    email: { type: String },
    password: { type: String },
},
    { timestamps: true }
)

const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;