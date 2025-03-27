const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    designations: [String],
    status: { type: String, enum: ['Inactive', 'Active'] },
    role: String,
    isAdmin: Boolean,
    registeredEvents: Array,
    // isFaculty: { type: Boolean, default: true },
}, {
    timestamps: true,
}
);

const User = mongoose.model('user', userSchema);

module.exports = User;
