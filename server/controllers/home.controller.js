const Job = require("../models/job");
const mongoose = require("mongoose");
const Position = require("../models/position");
const Employee = require("../models/employee");
const homeCtrl = {};

homeCtrl.getJobs = async (req,res) => {
    const home = await Job.find()
    .populate({ path: "id" })
    .populate({
      path: "dropzone",
      model: Position,
      populate: { path: "employee", model: Employee }
    })
    .exec();
  res.json(home);
}

module.exports = homeCtrl;