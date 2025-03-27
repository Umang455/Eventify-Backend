const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const courseSchema = new Schema({
    code: String,
    name: String,
    semester: String,
    modules: [Object],
}, {
    timestamps: true,
}
);

const Course = mongoose.model('course', courseSchema);

module.exports = Course;
