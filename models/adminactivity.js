const mongoose = require("mongoose")

const adminActivitySchema = new mongoose.Schema({
    adminId: { type: String },
    type: { type: String },
    ip: { type: String },
    adminAgent: { type: String },
    timestamp: { type: String },
},
    { timestamps: true }
)

const adminActivity = mongoose.model("adminActivity", adminActivitySchema);
module.exports = adminActivity;