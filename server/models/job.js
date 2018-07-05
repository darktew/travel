const mongoose = require('mongoose');
const { Schema } = mongoose;
const Position = require('./position');

const JobSchema = new Schema({
    _id: Schema.Types.ObjectId,
    jobname: String,
    address: [{type: Schema.Types.ObjectId, ref: 'Position', required: true}]
});


module.exports = mongoose.model('Job', JobSchema);