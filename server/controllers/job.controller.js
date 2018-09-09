const Job = require("../models/job");
const Position = require("../models/position");
const Employee = require("../models/employee");
const mongoose = require("mongoose");
const google_distance = require("google-distance");
google_distance.apiKey = "AIzaSyB82hkYAY3SZRDmpH_SCcd3W8NgAnl9TPw";
const jobCtrl = {};
jobCtrl.getJobs = async (req, res) => {
  const job = await Job.find()
    .populate({ path: "id" })
    .populate({
      path: "dropzone",
      model: Position,
      populate: { path: "employee", model: Employee }
    })
    .exec();
  res.json(job);
};
jobCtrl.createJob = async (req, res) => {
  const id = "";
  await calDistance(req, id, res);
  //-------

  //-------
};
jobCtrl.getJob = async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate({ path: "id" })
    .populate({
      path: "dropzone",
      model: Position,
      populate: { path: "employee", model: Employee }
    })
    // .populate({
    //   path: "dis",
    //   model: Position,
    //   populate : { path : "address", model: Position }
    // })
    .exec();
  res.json(job);
};

jobCtrl.editJob = async (req, res) => {
  const { id } = req.params;
  await calDistance(req, id, res);
};
jobCtrl.deleteJob = async (req, res) => {
  await Job.findByIdAndRemove(req.params.id);
  res.json({
    status: "Job Deleted success"
  });
};

//Function Calculate
function calDistance(req, _id, res) {
  // Check method post or put
  var id;
  if (_id == "") {
    console.log("id Create", id);
  } else {
    id = _id;
    console.log("Id edit", id);
  }

  // req values
  const position = req.body.id;
  const latitude = req.body.lattitude;
  const longtitude = req.body.longtitude;
  const address = req.body.address;
  var unorder_list = [];
  //insert values into unorder_list
  for (i = 0; i < latitude.length; i++) {
    unorder_list.push({  
      id: position[i],
      address: address[i],
      lattitude: latitude[i],
      longtitude: longtitude[i]
    }); 
  }
  
  //STEP 2 : set order origins
  var origins = {
    address: "Unnamed Road, Tambon Chiang Rak Noi, Amphoe Bang Pa-in, Chang Wat Phra Nakhon Si Ayutthaya 13180, Thailand",
    lattitude: 14.133635,
    longtitude: 100.616024
  };
  var order = [];
  order.push(origins);
  //STEP 3 :
  var objcreate_time = {};
  //LOOP UNTIL UNORDER IS EMPTY
  do {
    //reset distance for loop times
    var distance = [];
    //FIND DISTANCE FROM A CURRENT POINT
    for (i = 0; i < unorder_list.length; i++) {
      var dist = getDistanceFromLatLonInKm(
        order[order.length - 1].lattitude,
        order[order.length - 1].longtitude,
        unorder_list[i].lattitude,
        unorder_list[i].longtitude
      );
      unorder_list[i].distance = dist;
      distance.push(unorder_list[i]);
      //total = total + dist;
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
  } while (unorder_list.length > 0);

  //Step 3.5 Create Object like dropzone
  var dropzone1 = [];
  for (i = 0; i < latitude.length; i++) {
    dropzone1.push(position[i]);
  }
  var total = 0;
  for (j = 1; j < order.length; j++) {
    total += order[j].distance;
  }
  //google Distance and Time
  var arr_origin = [];
  var arr_des = [];
  var origin = 0;
  var des = 0;
  var i = 0;
  do {
    origin = i;
    des = i + 1;
    var str_origin = order[origin].lattitude+","+order[origin].longtitude;
    var str_des = order[des].lattitude+","+order[des].longtitude;
    arr_origin.push(str_origin);
    arr_des.push(str_des);
    i++;
  } while(order[des].address !== undefined && order[origin].address !== order[order.length - 2 ].address);
  google_distance.get({
    origins: arr_origin,
    destinations: arr_des
  }, function (err, data) {
    if (err) return console.log(err);
    console.log(data);
    var obj = {
      _id: id,
      jobname: req.body.jobname,
      id: position,
      address: address,
      dis: order,
      delivery: req.body.delivery,
      total: total,
      lattitude: latitude,
      longtitude: longtitude,
      dropzone: dropzone1
    };
    //SAVE
    save_callback(req, res, obj, data);
  });
  // google_distance.get(
  //   {
  //     origins: ['San Francisco, CA','San Diego, CA'],
  //     destinations: ['San Diego, CA','Seattle, WA']
  //   },
  //   function(err, data) {
  //     if (err) return console.log(err);
  //     for(i = 0; i< data.length;i++) {
  //     console.log(data[i].distance);
  //     }
  //   });
}

function save_callback(req, res, obj, data) {
  //Step 4 : save job
  var job;
  //edit
 
    if (obj._id !== undefined) {
      job = new Job({
        jobname: obj.jobname,
        id: obj.id,
        address: obj.address,
        dis: obj.dis,
        date: new Date(),
        delivery: obj.delivery,
        total: obj.total,
        lattitude: obj.lattitude,
        longtitude: obj.longtitude,
        //hour: objcreate_time.hour,
        //min: objcreate_time.min,
        //full_hour: Math.floor(total / 60),
        //full_min: Math.round(total % 60),
        dropzone: obj.dropzone
      });

      Job.findByIdAndUpdate(obj._id, { $set: job }, { new: true });
      return res.json({
        status: "Job Updated Saved"
      });
    }
    //create
    else {
      job = new Job({
        _id: new mongoose.Types.ObjectId(),
        jobname: obj.jobname,
        id: obj.id,
        address: obj.address,
        dis: obj.dis,
        date: new Date(),
        delivery: obj.delivery,
        total: obj.total,
        lattitude: obj.lattitude,
        longtitude: obj.longtitude,
        // hour: objcreate_time.hour,
        // min: objcreate_time.min,
        // full_hour: Math.floor(total / 60),
        // full_min: Math.round(total % 60),
        dropzone: obj.dropzone
      });
      job.save();

      return res.json({
        status: "Job Create Saved"
      });

    }
  
}
function calTimeHour(dist) {
  var Hour = [];
  var Min = [];
  var Obj_time = {
    hour: Hour,
    min: Min
  };

  if (Math.floor(dist / 60) == hour_time) {
    var hour_time = 0;
    Hour.push(hour_time);
  } else {
    var hour_time = Math.floor(dist / 60);
    Hour.push(hour_time);
  }
  //Get min for round
  if (Math.round(dist % 60) == 0) {
    var min_time = 0;
    Min.push(min_time);
  } else {
    var min_time = Math.round(dist % 60);
    Min.push(min_time);
  }
  Obj_time = {
    hour: Hour,
    min: Min
  };
  return Obj_time;
}
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
module.exports = jobCtrl;
