const Employee = require('../models/employee');
const Position = require('../models/position');
const mongoose = require('mongoose');
const employeeCtrl = {};

employeeCtrl.getEmployees = async (req, res) => {
    const employees = await Employee.find()
        .populate({path:'address', model: Position})
        .exec();
    res.json(employees);
        
};

employeeCtrl.createEmployee = async (req, res) => {
    const dname = req.body.name;
    const phone = req.body.phone;
    const employee = new Employee({
        _id: new mongoose.Types.ObjectId(),
        name: dname,
        phone: phone
    });
    await employee.save();
    res.json({
        'status' : 'Customer Saved'
    });
};

employeeCtrl.getEmployee = async (req, res) => {
    const employee = await Employee.findById(req.params.id)
    .populate({path: 'address', model: Position})
    .exec();
    res.json(employee);
};

employeeCtrl.editEmployee = async (req, res) =>{
    const { id } = req.params;
    const employee = {
        name: req.body.name,
        phone: req.body.phone
    }
    await Employee.findByIdAndUpdate(id, {$set: employee},{ new: true });
    res.json({
        status: 'Customer Updated'
    });
};
employeeCtrl.deleteEmployee = async (req, res) => {
      await Employee.findByIdAndRemove(req.params.id);
      res.json({
          status: 'Customer Deleted success'
      });
};

module.exports = employeeCtrl;