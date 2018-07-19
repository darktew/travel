const Job = require('../models/job');
const Position = require('../models/position');
const mongoose = require('mongoose');

const jobCtrl = {};


jobCtrl.getJobs = async (req, res) => {
    const job = await Job.find()
    .populate({path: "address"})
    .exec();
    res.json(job);
        
};
jobCtrl.createJob = async (req, res) => {
     const position = req.body.id;
     const latitude = req.body.lattitude;
     const longtitude = req.body.longtitude;
    console.log("position",position,"lat", latitude, "lng", longtitude);
    //Step 1 : input lat lng position
    var unorder_list = [];
    for (i=0;i<latitude.length;i++) {
        unorder_list.push({
            address : position[i],
            lattitude : latitude[i],
            longtitude : longtitude[i]
        });
    };
    console.log(unorder_list);
     //STEP 2 : set order origins
    var origins = {
        address: "VRU",
        lattitude:13.762089,
        longtitude:100.485557
    };
    var order = [];
    order.push(origins);
    console.log(origins);
     //STEP 3 : 
    var distance = [];
    do{
     for (i=0;i<unorder_list.length;i++) {
        var dist = getDistanceFromLatLonInKm(
            order[order.length-1].lattitude,order[order.length-1].longtitude,
            unorder_list[i].lattitude,unorder_list[i].longtitude);
        unorder_list[i].distance = dist;
        distance.push(unorder_list[i]);
     }
    var min = distance[0].distance;
    var point = 0;
    for (var i = 1; i < distance.length; i++) {
        var v = distance[i].distance;
        if (v<min) {
            min = v;
            point = i;
        } else {
            min = min;
            point = point;
        }
    }
    order.push(unorder_list[point]);  
    unorder_list.splice(point,1);
}while(unorder_list.length !==0)
    console.log("order: ",order, "unorder",unorder_list);

     //Step 4 : save
    const job = new Job({
        _id: new mongoose.Types.ObjectId(),
        jobname: req.body.jobname,
        address: position,
        dis: order,
        date: new Date,
        delivery: req.body.delivery
    });
    await job.save();
    res.json({
        'status' : 'Job Saved'
    });
};
jobCtrl.getJob = async (req, res) => {
    const job = await Job.findById(req.params.id)
    .populate({path: "address"})
    .exec();
    res.json(job);
};

jobCtrl.editJob = async (req, res) =>{
    const { id } = req.params;
    const position = req.body.id;
     const latitude = req.body.lattitude;
     const longtitude = req.body.longtitude;

    //Step 1 : input lat lng position
    var unorder_list = [];
    for (i=0;i<latitude.length;i++) {
        unorder_list.push({
            address : position[i],
            lattitude : latitude[i],
            longtitude : longtitude[i]
        });
    };

     //STEP 2 : set order origins
    var origins = {
        address: "VRU",
        lattitude:13.762089,
        longtitude:100.485557
    };
    var order = [];
    order.push(origins);

     //STEP 3 : 
    var distance = [];
    do{
     for (i=0;i<unorder_list.length;i++) {
        var dist = getDistanceFromLatLonInKm(
            order[order.length-1].lattitude,order[order.length-1].longtitude,
            unorder_list[i].lattitude,unorder_list[i].longtitude);
        unorder_list[i].distance = dist;
        distance.push(unorder_list[i]);
     }
    var min = distance[0].distance;
    var point = 0;
    for (var i = 1; i < distance.length; i++) {
        var v = distance[i].distance;
        if (v<min) {
            min = v;
            point = i;
        } else {
            min = min;
            point = point;
        }
    }
    order.push(unorder_list[point]);  
    unorder_list.splice(point,1);
}while(unorder_list.length !==0)
    const job = {
        jobname: req.body.jobname,
        address: position,
        dis: order
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
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
module.exports = jobCtrl;
