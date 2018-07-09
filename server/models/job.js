const mongoose = require('mongoose');
const { Schema } = mongoose;

const JobSchema = new Schema({
    _id: Schema.Types.ObjectId,
    jobname: String,
    address: [{type: Schema.Types.ObjectId, ref: 'Position', required: true}],
    dis: Object,
    date: Date
});


module.exports = mongoose.model('Job', JobSchema);