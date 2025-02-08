const mongoose = require("mongoose")

const userActivitySchema = new mongoose.Schema({
    userId: { type: String },
    type: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    timestamp: { type: String },
},
    { timestamps: true }
)

const UserActivity = mongoose.model("userActivity", userActivitySchema);
module.exports = UserActivity;