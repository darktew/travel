const mongoose = require('mongoose');
const { Schema } = mongoose;

const PositionSchema = new Schema({
   _id: Schema.Types.ObjectId,
    address: String,
   lattitude: Number,
   longtitude: Number, 
   employee: {type: mongoose.Schema.Types.ObjectId, ref: 'Employee',required: true},
});

module.exports = mongoose.model('Position', PositionSchema);