const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmployeeSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    address: {type: Schema.Types.ObjectId, ref:'Position'}
});

module.exports = mongoose.model('Employee', EmployeeSchema);