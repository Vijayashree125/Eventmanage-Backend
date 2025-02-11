const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    title: { type: String},
    description: { type: String },
    date: { type: Date },
    location: { type: String },
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

},
    { timestamps: true }
)

const Event = mongoose.model("events", eventSchema);
module.exports = Event;