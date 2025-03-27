const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const activitySchema = new Schema({
    name: String,
    outcome: String,
    date: String,
    certificate: String,
    studentName: String,
    studentID: String,
    StudentRno: String,
}, {
    timestamps: true,
}
);

const Activity = mongoose.model('activity', activitySchema);

module.exports = Activity;
