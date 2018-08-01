const Job = require('../models/job');
const Position = require('../models/position');
const mongoose = require('mongoose');

const jobCtrl = {};
jobCtrl.getJobs = async (req, res) => {
    const job = await Job.find()
        .populate({ path: "id" })
        .exec();
    res.json(job);

};
jobCtrl.createJob = async (req, res) => {
    const position = req.body.id;
    const latitude = req.body.lattitude;
    const longtitude = req.body.longtitude;
    console.log("position", position, "lat", latitude, "lng", longtitude);
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
    var distance = [];
    var total = 0;
    var hour_time = 0;
    var min_time = 0;
    var full_min = 0;
    var full_hour = 0;
    var arr_fullhour = [];
    var arr_fullmin = [];
    var arrMin = [];
    var arrHour = [];
    do {
        for (i = 0; i < unorder_list.length; i++) {
            var dist = getDistanceFromLatLonInKm(
                order[order.length - 1].lattitude, order[order.length - 1].longtitude,
                unorder_list[i].lattitude, unorder_list[i].longtitude);

            unorder_list[i].distance = dist;
            distance.push(unorder_list[i]);
            total = total + dist;
            //Get hour for round 
            if (Math.floor(dist/60) == hour_time ) {
                hour_time = 0;
                arrHour.push(hour_time);
            } else  {
                 hour_time = Math.floor(dist/60);
                 arrHour.push(hour_time);
            }
            //Get min for round 
            if (Math.round(dist%60) == 0) {
                min_time = 0;
                arrMin.push(min_time);
            } else {
                min_time = Math.round(dist%60);
                arrMin.push(min_time);
            }
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
    } while (unorder_list.length !== 0)
    for (j=0;j<arrHour.length;j++) {
        full_hour = full_hour + arrHour[j];
        full_min = full_min + arrMin[j];
    }
    arr_fullhour.push(full_hour);
    arr_fullmin.push(full_min);
    console.log(arrMin,"Min Array", arrHour, "Hour Array");
    console.log(arr_fullhour,"Full Hour", arr_fullmin,"Full Min");
    // for (var i = 1; i< order.length; i++) {
    //     var total_distance = 0;
    //     total_distance += order[i].distance;
    //     console.log("list",i,"order",order[i].distance);
    //     console.log("total", total_distance);
    // }
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
        hour: arrHour,
        min: arrMin,
        full_hour: arr_fullhour,
        full_min: arr_fullmin
    });
    console.log("Job new Time",job);
    await job.save();
    res.json({
        'status': 'Job Saved'
    });
};
jobCtrl.getJob = async (req, res) => {
    const job = await Job.findById(req.params.id)
        .populate({ path: "id" })
        .exec();
    res.json(job);
};

jobCtrl.editJob = async (req, res) => {
    const { id } = req.params;
    const latitude = req.body.lattitude;
    const longtitude = req.body.longtitude;
    console.log("position", position, "lat", latitude, "lng", longtitude);
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
    var distance = [];
    var total = 0;
    do {
        for (i = 0; i < unorder_list.length; i++) {
            var dist = getDistanceFromLatLonInKm(
                order[order.length - 1].lattitude, order[order.length - 1].longtitude,
                unorder_list[i].lattitude, unorder_list[i].longtitude);

            unorder_list[i].distance = dist;
            distance.push(unorder_list[i]);
            console.log("dist", dist);
            total = total + dist;
            console.log("total", total);

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
    } while (unorder_list.length !== 0)
    console.log("orderNew", order);
    const job = {
        jobname: req.body.jobname,
        id: position,
        dis: order,
        address: req.body.address,
        date: new Date,
        delivery: req.body.delivery,
        total: total,
        lattitude: latitude,
        longtitude: longtitude
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
module.exports = jobCtrl;
