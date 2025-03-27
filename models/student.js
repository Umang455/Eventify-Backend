const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const studentSchema = new Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    image: String,
    rollNo: String,
    isStudent: { type: Boolean, default: true },
    coursesRegistered: [Object],
    status: { type: String, enum: ['Inactive', 'Active'] },

}, {
    timestamps: true,
}
);

const Student = mongoose.model('student', studentSchema);

module.exports = Student;
