const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmployeeSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true }
});

module.exports = mongoose.model('Employee', EmployeeSchema);