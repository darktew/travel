const Jobdetail = require('../models/jobdetail');
const mongoose = require('mongoose');
const jobdetailCtrl = {};

jobdetailCtrl.getJobsdetail = async (req, res) => {
    const jobdetail = await Jobdetail.find()
        .populate({path:'job'})
        .exec();
    res.json(jobdetail);
        
};

jobdetailCtrl.createJobdetail = async (req, res) => {
    const jobdetail = new Jobdetail({
        _id: new mongoose.Types.ObjectId(),
        job: req.body.id
    });
    await jobdetail.save();
    res.json({
        'status' : 'Job Saved'
    });
};

jobdetailCtrl.getJobdetail = async (req, res) => {
  
    const jobdetail = await Jobdetail.findById(req.params.id);
    res.json(jobdetail);
};

jobdetailCtrl.editJobdetail = async (req, res) =>{
    const { id } = req.params;
    const jobdetail = {
        job: req.body.id
    }
    await Jobdetail.findByIdAndUpdate(id, {$set: jobdetail},{ new: true });
    res.json({
        status: 'Job Updated'
    });
};
jobdetailCtrl.deleteJobdetail = async (req, res) => {
      await Jobdetail.findByIdAndRemove(req.params.id);
      res.json({
          status: 'Job Deleted success'
      });
};
module.exports = jobdetailCtrl;
