const mongoose = require('mongoose');
const { Schema } = mongoose;

const JobSchema = new Schema({
    _id: Schema.Types.ObjectId,
    jobname: String,
    id: [{type: Schema.Types.ObjectId, ref: 'Position', required: true}],
    address: Object,
    dis: Object,
    date: Date,
    delivery: Number,
    total: Number,
    lattitude: [Number],
    longtitude: [Number]
    
});


module.exports = mongoose.model('Job', JobSchema);