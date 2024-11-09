const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    mobile: String,
    designation: String,
    gender: String,
    courses: [String],
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);