const mongoose = require('mongoose');
const { Schema } = mongoose;

const JobSchema = new Schema({
    _id: Schema.Types.ObjectId,
    jobname: String,
});


module.exports = mongoose.model('Job', JobSchema);