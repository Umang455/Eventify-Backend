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
    // isFaculty: { type: Boolean, default: true },
}, {
    timestamps: true,
}
);

const User = mongoose.model('user', userSchema);

module.exports = User;
