const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    designations: [String],
    status: { type: String, enum: ['Inactive', 'Active'], default: 'Active' },
    role: { type: String, enum: ['User', 'EventHead', 'Admin'], default: 'User' },
    isAdmin: { type: Boolean, default: false },
    registeredEvents: Array,
    bio: { type: String, default: '' },
    interests: [{ type: String }],
    profilePicture: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'], default: 'Prefer not to say' },
    dateOfBirth: { type: Date },
    preferences: {
        eventTypes: [{ type: String }],
        notificationSettings: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true }
        }
    }
}, {
    timestamps: true,
}
);

const User = mongoose.model('user', userSchema);

module.exports = User;
