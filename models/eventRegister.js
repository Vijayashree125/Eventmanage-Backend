const mongoose = require("mongoose")

const eventregistrationSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    registrationDate: { type: Date, default: Date.now }
},
    { timestamps: true }
)

const registration = mongoose.model("eventRegistration", eventregistrationSchema);
module.exports = registration;