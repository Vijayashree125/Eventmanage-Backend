const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    date: { type: Date },
    location: { type: String, default: "" },
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

},
    { timestamps: true }
)

const Event = mongoose.model("events", eventSchema);
module.exports = Event;