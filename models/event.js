const mongoose = require('mongoose');

// Event Schema
const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventType: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    people: { type: String },
    cateringReq: { type: Boolean, default: false },
    catering: { type: String },
    eventTime: { type: Date, required: true },
    eventDuration: { type: String },
    venue: { type: String },
    theme: { type: String },
    budget: { type: String },
    activities: { type: String },
    decoration: { type: String },
    registeredUsers: { type: Array },
    createdBy: { type: String },
    createdById: { type: String },
}, { timestamps: true });

// Create Event model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
