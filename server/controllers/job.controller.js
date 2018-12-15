const Job = require("../models/job");
const Position = require("../models/position");
const Employee = require("../models/employee");
const mongoose = require("mongoose");
const cron = require('node-cron');
const webpush = require('web-push');
const publicKey = 'BINAC1RqNkIxlFY1GGDU8XcUeG0HSzL85-qYdS0GBz3sY_6mDmEISK1_PQMVxHUnBuGqE9WerWsKFtCQDlqzHIo';
const vapidPublicKey = 'WWq6EPB5aIL30A5rSDPa0Z2sx6WmLvXCOgsjshIAEHY';
// SET PUSH NOTIFICATION 
webpush.setVapidDetails('mailto:darktew123@gmail.com', publicKey, vapidPublicKey);
// const worker = require('../client');

const google = require('@google/maps').createClient({
  key: 'AIzaSyB82hkYAY3SZRDmpH_SCcd3W8NgAnl9TPw'
});
const jobCtrl = {};
jobCtrl.getJobs = async (req, res) => {
  const job = await Job.find()
    .populate({ path: "id", model: Position, populate: { path: "employee", model: Employee } })
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
  const io = req.app.get('io');
  const job = calDistance(req, id, res);
  var test;
  await google_directions(job).then(
    data => test = data
  ).catch(
    err => console.log(err)
  );
  const save = getValuesTosave(test, job);
  await save.save().then(()=> {
    io.emit('createjob');
  });
  res.json({
    status: "Save Success"
  });

  // google_directions module
  // for (i = 0,j = 1; i< test.json["routes"][0]["legs"].length, j <= job.dis.length; i++,j++ ) {
  //    job.dis[j].distance = test.json["routes"][0]["legs"][i].distance;
  //    job.dis[j].duration = test.json["routes"][0]["legs"][i].duration;
  //}

  // test.json["routes"][0]["legs"][i].duration
  // test.json["routes"][0]["legs"][i].distance
  //-------
};
jobCtrl.getJob = async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate({ path: "id", model: Position, populate: { path: "employee", model: Employee } })
    .populate({
      path: "dropzone",
      model: Position,
      populate: { path: "employee", model: Employee }
    })
    .exec();
  res.json(job);

};

jobCtrl.editJob = async (req, res) => {
  const { id } = req.params;
  const job = calDistance(req, id, res);
  var test;
  await google_directions(job).then(
    data => test = data
  ).catch(
    err => console.log(err)
  );
  const save = getValuesTosave(test, job);
  await Job.findByIdAndUpdate(id, { $set: save }, { new: true });
  res.json({
    status: "Job Update Success"
  });
};
jobCtrl.usereditJob = async (req, res) => {
  const { id } = req.params;
  const job = calUserDistance(id, req, res);
  var test;
  await google_directions(job).then(
    data => test = data
  ).catch(
    err => console.log(err)
  );
  const save = getValuesTosave(test, job);
  await Job.findByIdAndUpdate(id, { $set: save }, { new: true });
  res.json({
    status: "Job Update by User Success"
  });
};
jobCtrl.deleteJob = async (req, res) => {
  await Job.findByIdAndRemove(req.params.id);
  res.json({
    status: "Job Deleted success"
  });
};
jobCtrl.statusJob = async (req, res) => {
  const { id } = req.params;
  const status = req.body.status;
  const date_time = new Date().toLocaleString();
  console.log(date_time);
  const io = req.app.get('io');
  const obj_time = req.body.obj_time;
  await Job.findByIdAndUpdate(id, { $set: {
    date: date_time, 
    status: status
  } 
}, { new: true });
  if (status == 'กำลังจัดส่ง') {
    var hour_new = new Date().getHours();
    var min_new = new Date().getMinutes();
    var hour = obj_time.hour + hour_new;
    var min = obj_time.min + min_new;
    if (hour >= 24) {
      hour = hour - 24;
    } else {
      hour = hour;
    }
    if(min >= 60) {
      min = min - 60;
    }else {
      min = min;
    }
    const take = cron.schedule(min + " " + hour + ' * * *', function () {
      console.log("--------------------------");
      console.log(" Running Update Status ");
      cronTime(id, res, io, (response, err) => {
        if (err) {
          return console.log("Save Not Success");
        } else {
          io.sockets.emit('ChangeStatus', {message: 'Status Success ?'});
          return take.stop();
        }
      });
    });
   
    res.json({
      status: "Job Update Status Success"
    });
  } else {
    res.json({
      status: "Job Update Status Success"
    });
  }
}

let cronTime = (id, res, io,callbackFn) => {
  Job.findByIdAndUpdate(id, { $set: { status: 'จัดส่งเสร็จสิ้น' } }, { new: true }, (err, res) => {
    if (err) {
      callbackFn(err, null);
    } else {
      callbackFn(res, err);
    }
  });
}



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
  var status = "";
  if (req.body.status !== '') {
    status = req.body.status;
  } else {
    status = "เตรียมการจัดส่ง";
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
      longtitude: longtitude[i],
    });
  }

  //STEP 2 : set order origins
  var origins = {
    address: "Unnamed Road, Tambon Chiang Rak Noi, Amphoe Bang Pa-in, Chang Wat Phra Nakhon Si Ayutthaya 13180, Thailand",
    lattitude: 14.133635,
    longtitude: 100.616024,
    distance: 0,
    duration: 0
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

  //  Save manual
  //SAVE
  var obj = {
    _id: id,
    jobname: req.body.jobname,
    id: position,
    address: address,
    dis: order,
    total: total,
    lattitude: latitude,
    longtitude: longtitude,
    dropzone: dropzone1,
  };

  var job;

  if (id != undefined) {
    job = new Job({
      jobname: obj.jobname,
      id: obj.id,
      address: obj.address,
      dis: obj.dis,
      date: new Date(),
      total: obj.total,
      lattitude: obj.lattitude,
      longtitude: obj.longtitude,
      //hour: objcXreate_time.hour,
      //min: objcreate_time.min,
      //full_hour: Math.floor(total / 60),
      //full_min: Math.round(total % 60),
      dropzone: obj.dropzone
    });
    return job;
  } else {
    job = new Job({
      _id: new mongoose.Types.ObjectId(),
      jobname: obj.jobname,
      id: obj.id,
      address: obj.address,
      dis: obj.dis,
      date: new Date(),
      total: obj.total,
      lattitude: obj.lattitude,
      longtitude: obj.longtitude,
      // hour: objcreate_time.hour,
      // min: objcreate_time.min,
      // full_hour: Math.floor(total / 60),
      // full_min: Math.round(total % 60),
      dropzone: obj.dropzone
    });
    return job;
  }
}

//Cal Userlist
function calUserDistance(id, req, res) {
  var position = req.body.id;
  var latitude = req.body.lattitude;
  var longtitude = req.body.longtitude;
  var address = req.body.address;
  var name = req.body.jobname;
  if (position.length == 0 && latitude.length == 0 && longtitude.length == 0 && address.length == 0) {

    var obj_jobname = {};
    obj_jobname = {
      'jobname': name
    }
    return obj_jobname;
  } else {

    var unorder_list = [];
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
      longtitude: 100.616024,
      distance: 0,
      duration: 0
    };
    var order = [];
    order.push(origins);

    //STEP 3 :
    var objcreate_time = {};
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

      order.push(unorder_list[0]);
      unorder_list.splice(0, 1);
    } while (unorder_list.length > 0);
    //Step 3.5 Create Object like dropzone
    var dropzone1 = [];
    for (i = 0; i < position.length; i++) {
      dropzone1.push(position[i]);
    };

    var total = 0;
    for (j = 1; j < order.length; j++) {
      total += order[j].distance;
    };

    //SAVE
    var obj = {
      jobname: name,
      id: position,
      address: address,
      dis: order,
      total: total,
      lattitude: latitude,
      longtitude: longtitude,
      dropzone: dropzone1
    };
    //set job after return to update
    var job;
    job = new Job({
      jobname: obj.jobname,
      id: obj.id,
      address: obj.address,
      dis: obj.dis,
      date: new Date(),
      total: obj.total,
      lattitude: obj.lattitude,
      longtitude: obj.longtitude,
      dropzone: obj.dropzone
    });

    return job;
  }
}
//cal Timer 
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
google_directions = (joblist) => {
  var origin = {
    lat: joblist.dis[0].lattitude,
    lng: joblist.dis[0].longtitude
  }
  var destination = {
    lat: joblist.dis[joblist.dis.length - 1].lattitude,
    lng: joblist.dis[joblist.dis.length - 1].longtitude
  }
  var waypointsArray = [];
  for (i = 1; i < joblist.dis.length - 1 ; i++) {
    waypointsArray.push(
      {
        lat: joblist.dis[i].lattitude,
        lng: joblist.dis[i].longtitude
      });
  }
  return new Promise((resolve, reject) => {
    google.directions({
      "origin": origin,
      "destination": destination,
      "waypoints": waypointsArray,
      "mode": "driving",
      "optimize": true,
      "language": "th"
    }, function (err, data) {
      if (err) reject(err);
      resolve(data);
    })
  });
};
function getValuesTosave(data, job) {
  for (i = 0, j = 1; i < data.json["routes"][0]["legs"].length, j < job.dis.length; i++ , j++) {
    job.dis[j].distance = data.json["routes"][0]["legs"][i].distance;
    job.dis[j].duration = data.json["routes"][0]["legs"][i].duration;
  }

  job.full = {
    distance_all: 0,
    duration_all: 0
  }
  var all_dis = 0;
  var all_dur = 0;
  for (z = 1; z < job.dis.length; z++) {
    all_dis = all_dis + job.dis[z].distance.value;
    all_dur = all_dur + job.dis[z].duration.value;
  };
  job.total = all_dis / 1000;
  var time = getTime(all_dur);
  job.time = time.string_time;
  job.obj_time = time;
  return job;
};
function getTime(time) {
  var hour = 0;
  var min = 0;
  if (Math.floor((time / 60) / 60) != 0) {
    hour = Math.floor((time / 60) / 60);
  } else {
    hour = hour;
  }
  if (Math.round((time / 60) % 60) != 0) {
    min = Math.round((time / 60) % 60);
  } else {
    min = min;
  }
  var string_time = "";
  if (hour == 0) {
    string_time = min + " นาที"
  } else {
    string_time = hour + " ชม. " + min + " นาที";
  }
  var obj_time = {
    hour: hour,
    min: min,
    string_time: string_time
  }
  return obj_time;
}

module.exports = jobCtrl;

