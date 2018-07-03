const Employee = require('../models/employee');
const mongoose = require('mongoose');
const employeeCtrl = {};

employeeCtrl.getEmployees = async (req, res) => {
    const employees = await Employee.find();
    res.json(employees);
        
};

employeeCtrl.createEmployee = async (req, res) => {
    const employee = new Employee({
        name: req.body.name
    });
    await employee.save();
    res.json({
        'status' : 'Customer Saved'
    });
};

employeeCtrl.getEmployee = async (req, res) => {
  
    const employee = await Employee.findById(req.params.id)
    res.json(employee);
};

employeeCtrl.editEmployee = async (req, res) =>{
    const { id } = req.params;
    const employee = {
        name: req.body.name
    }
    await Employee.findByIdAndUpdate(id, {$set: employee},{ new: true });
    res.json({
        status: 'Customer Updated, ' + id 
    });
};
employeeCtrl.deleteEmployee = async (req, res) => {
      await Employee.findByIdAndRemove(req.params.id);
      res.json({
          status: 'Customer Deleted success'
      });
};

module.exports = employeeCtrl;