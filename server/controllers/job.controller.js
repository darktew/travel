const Job = require('../models/job');
const Position = require('../models/position');
const Employee = require('../models/employee');
const mongoose = require('mongoose');

const jobCtrl = {};
jobCtrl.getJobs = async (req, res) => {
    const job = await Job.find()
        .populate({ path: "id" })
        .populate({path: "dropzone", model: Position, populate: {path: "employee", model: Employee}})
        .exec();
    res.json(job);

};
jobCtrl.createJob = async (req, res) => {
    const position = req.body.id;
    const latitude = req.body.lattitude;
    const longtitude = req.body.longtitude;
    //Step 1 : input lat lng position
    var unorder_list = [];
    for (i = 0; i < latitude.length; i++) {
        unorder_list.push({
            address: position[i],
            lattitude: latitude[i],
            longtitude: longtitude[i]
        });
    };
    //STEP 2 : set order origins
    var origins = {
        address: "VRU",
        lattitude: 13.762089,
        longtitude: 100.485557
    };
    var order = [];
    order.push(origins);
    //STEP 3 : 
   
    var total = 0;
    var objcreate_time = {};
    //LOOP UNTIL UNORDER IS EMPTY
    do {
        //reset distance for loop times
        var distance = [];
        //FIND DISTANCE FROM A CURRENT POINT
        console.log("unorder_list : ", unorder_list);
        for (i = 0; i < unorder_list.length; i++) {
            var dist = getDistanceFromLatLonInKm(
                order[order.length - 1].lattitude, order[order.length - 1].longtitude,
                unorder_list[i].lattitude, unorder_list[i].longtitude);

            unorder_list[i].distance = dist;
            distance.push(unorder_list[i]);
            total = total + dist;
            //Get hour and min for round 
                objcreate_time = calTimeHour(dist);
            }
            //FIND MIN DISTANCE POINT
            var min = distance[0].distance;
            var point = 0;
            for (var i = 1; i < distance.length; i++) {
                var v = distance[i].distance;
                if (v < min) {
                    min = v;
                    point = i;
                } else {
                    min = min;
                    point = point;
                } 
            }
        
        order.push(unorder_list[point]);
        unorder_list.splice(point, 1);
    } while (unorder_list.length > 0)
    
    //Step 3.5 Create Object like dropzone
    var dropzone1 = [];
    for(i=0;i<latitude.length;i++){
        dropzone1.push(position[i]);
    }
    //Step 4 : save
    const job = new Job({
        _id: new mongoose.Types.ObjectId(),
        jobname: req.body.jobname,
        id: position,
        address: req.body.address,
        dis: order,
        date: new Date,
        delivery: req.body.delivery,
        total: total,
        lattitude: latitude,
        longtitude: longtitude,
        hour: objcreate_time.hour,
        min: objcreate_time.min,
        full_hour: Math.floor(total / 60),
        full_min: Math.round(total % 60),
        dropzone: dropzone1
    });
    await job.save();
    res.json({
        'status': 'Job Saved'
    });
};
jobCtrl.getJob = async (req, res) => {
    const job = await Job.findById(req.params.id)
        .populate({ path: "id" })
        .populate({path: "dropzone", model: Position, populate: {path: "employee", model: Employee}})
        .exec();
    res.json(job);
};

jobCtrl.editJob = async (req, res) => {
    const { id } = req.params;
    const position = req.body.id;
    const latitude = req.body.lattitude;
    const longtitude = req.body.longtitude;
    
    //Step 1 : input lat lng position
    var unorder_list = [];
    for (i = 0; i < latitude.length; i++) {
        unorder_list.push({
            address: position[i],
            lattitude: latitude[i],
            longtitude: longtitude[i]
        });
    };
    //STEP 2 : set order origins
    var origins = {
        address: "VRU",
        lattitude: 13.762089,
        longtitude: 100.485557
    };
    var order = [];
    order.push(origins);
    //STEP 3 : Calculate distance and time
    var total = 0;
    var objedit_time = {}; 
    //LOOP UNTIL UNORDER IS EMPTY
    do {
        //reset distance for loop times
        var distance = [];
        //FIND DISTANCE FROM A CURRENT POINT
       
        for (i = 0; i < unorder_list.length; i++) {
            var dist = getDistanceFromLatLonInKm(
                order[order.length - 1].lattitude, order[order.length - 1].longtitude,
                unorder_list[i].lattitude, unorder_list[i].longtitude);
                
            unorder_list[i].distance = dist;
            distance.push(unorder_list[i]);
            total = total + dist;
            objedit_time = calTimeHour(dist);
           
          
            //FIND MIN DISTANCE POINT
            var min = distance[0].distance;
            var point = 0;
            for (var i = 1; i < distance.length; i++) {
                var v = distance[i].distance;
                if (v < min) {
                    min = v;
                    point = i;
                } else {
                    min = min;
                    point = point;
                } 
            }
        }
        order.push(unorder_list[point]);
       
        unorder_list.splice(point, 1);
    } while (unorder_list.length > 0)
    
    
    //Step 3.5 Create Object like dropzone
    var dropzone1 = [];
    for(i=0;i<latitude.length;i++){
        dropzone1.push(position[i]);
    }
    const job = {
        jobname: req.body.jobname,
        id: position,
        address: req.body.address,
        dis: order,
        date: new Date,
        delivery: req.body.delivery,
        total: total,
        lattitude: latitude,
        longtitude: longtitude,
        hour: objedit_time.hour,
        min: objedit_time.min,
        full_hour: Math.floor(total / 60),
        full_min: Math.round(total % 60),
        dropzone: dropzone1
    }
    await Job.findByIdAndUpdate(id, { $set: job }, { new: true });
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

//Function Calculate 
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
function calTimeHour(dist) {
    var Hour = [];
    var Min = [];
     var Obj_time = {
        hour: Hour,
        min: Min
     };
    
    if (Math.floor(dist/60) == hour_time ) {
        var hour_time = 0;
        Hour.push(hour_time);
    } else  {
        var hour_time = Math.floor(dist/60);
         Hour.push(hour_time);
    }
    //Get min for round 
    if (Math.round(dist%60) == 0) {
        var min_time = 0;
        Min.push(min_time);
    } else {
        var min_time = Math.round(dist%60);
        Min.push(min_time);
    }
    Obj_time = {
        hour: Hour,
        min: Min
    }
    console.log("Obj_time Set", Obj_time);
    return Obj_time;
}
module.exports = jobCtrl;
