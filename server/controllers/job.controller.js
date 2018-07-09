const Job = require('../models/job');
const Position = require('../models/position');
const mongoose = require('mongoose');
const tofixed = require('tofixed');
const jobCtrl = {};


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
     var position = req.body.id;
    // console.log(position);
     var latitude = req.body.lattitude;
     var longtitude = req.body.longtitude;
    // var dis;
    // var dura;

    //Step 1 : dkfjslk
    var unorder_list = [];
    for (i=0;i<latitude.length;i++) {
        unorder_list.push({
            address : position[i],
            lattitude : latitude[i],
            longtitude : longtitude[i]
        });
    };

    //     var destinations = {lat: latitude[i],lng: longtitude[i]};
    //     var dist = [];
    //     dist = getDistanceFromLatLonInKm(origins.lat,origins.lng,destinations.lat,destinations.lng);
    //     console.log(tofixed(dist,2));

        //Find Distance\
        //INPUT A : origin
        //INPUT B : DESTINATION
        //OUTPUT DISTANCE (float)
        //destinations.push(lat[i]+","+lng[i]);
        /*
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
        */
        //END Distance

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
}while(unorder_list==[])
    console.log("order: ",order, "unorder",unorder_list);

     //Step 4 : save
    const job = new Job({
        _id: new mongoose.Types.ObjectId(),
        jobname: req.body.jobname,
        address: position
        //dis: 
    });
    await job.save();
    res.json({
        'status' : 'Job Saved'
    });
};

// function distance(origins, destinations){
//     var x = (destinations.lat-origins.lat)*(destinations.lat-origins.lat);
//     var y = (destinations.lng-origins.lng)*(destinations.lng-origins.lng);
//     var distance = Math.sqrt(x+y);
//     return distance;
// }
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
jobCtrl.getJob = async (req, res) => {
    const job = await Job.findById(req.params.id)
    .populate({path: "address"})
    .exec();
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
