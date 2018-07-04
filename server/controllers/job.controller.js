const Job = require('../models/job');
const mongoose = require('mongoose');
const jobCtrl = {};

jobCtrl.getJobs = async (req, res) => {
    const job = await Job.find();
    res.json(job);
        
};

jobCtrl.createJob = async (req, res) => {
    const job = new Job({
        _id: new mongoose.Types.ObjectId(),
        jobname: req.body.jobname
    });
    await job.save();
    res.json({
        'status' : 'Job Saved'
    });
};

jobCtrl.getJob = async (req, res) => {
  
    const job = await Job.findById(req.params.id);
    res.json(job);
};

jobCtrl.editJob = async (req, res) =>{
    const { id } = req.params;
    const job = {
        jobname: req.body.jobname
    }
    await Job.findByIdAndUpdate(id, {$set: job},{ new: true });
    res.json({
        status: 'Job Updated'
    });
};
jobCtrl.deleteJob = async (req, res) => {
      await Job.findByIdAndRemove(req.params.id);
      res.json({
          status: 'Job Deleted success'
      });
};
module.exports = jobCtrl;
