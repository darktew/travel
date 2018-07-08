const Job = require('../models/job');
const Position = require('../models/position');
const mongoose = require('mongoose');
const geoLib = require('geo-lib');
const distance = require('google-distance');
const tofixed = require('tofixed');
const jobCtrl = {};
distance.apiKey = 'AIzaSyB82hkYAY3SZRDmpH_SCcd3W8NgAnl9TPw';
// distance.units('imperial');

jobCtrl.getJobs = async (req, res) => {
    const job = await Job.find()
    .populate({path: "address"})
    .exec();
    res.json(job);
        
};
jobCtrl.createJob = async (req, res) => {
    //สูตรหาค่าเวลาใช้ V = S/T
    /* V = ระยะทาง (distance)
       S = อัตราความเร็ว (speed)
       T = เวลา (T) */ 
    const lat = req.body.lattitude;
    const lng = req.body.longtitude;
    const start = ['13.762089,100.485557'];
    var origins = start;
    var destinations = [];
    var dis;
    var dura;
    for (i=0;i<lat.length;i++) {
        destinations.push(lat[i]+","+lng[i]);
        distance.get(
            {
                origin: origins,
                destination: destinations[i]
            },
            function(err, data) {
                if (err) return console.log(err);
                console.log(data);
                return {data};
            }
        );
        console.log(dis);
    };
    const job = new Job({
        _id: new mongoose.Types.ObjectId(),
        jobname: req.body.jobname,
        address: req.body.id,
        //dis: 
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
        jobname: req.body.jobname,
        address: req.body.id
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
