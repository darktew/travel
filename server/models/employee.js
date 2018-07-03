const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmployeeSchema = new Schema({
    name: { type: String, required: true },
});

module.exports = mongoose.model('Employee', EmployeeSchema);