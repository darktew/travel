const mongoose = require('mongoose');
const userCtrl = {};
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../database');

const User = require('../models/user');

userCtrl.Register = async (req,res) =>  {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        password_check: req.body.password_check
    });

  await User.addUser(newUser, (err,user)=> {
        if (err) {
            res.json({success: false, msg: 'Fail'});
        } else {
            res.json({success: true, msg: 'True'});
        }
    });
}

userCtrl.Auth = async (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    await User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: 'User not found'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 // 1 week
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, msg: 'Wrong Password'});
            }
        });
    });
};
userCtrl.Profile = async (req, res) => {
    res.json({user: req.user});
};
userCtrl.editProfile = async (req, res) => {
    let editUser = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        address: req.body.address,
        phone: req.body.phone
    }
    const id = req.params.id;
    console.log("editUser", id);
    await User.editUser(id,editUser, (err,user) => {
        if (err) {
            console.log(user);
            res.json({success: false, msg: 'Fail'});
        } else {
            console.log(user);
            res.json({success: true, msg: 'True'});
        }
    });
};
userCtrl.userImage = async (req,res) => {
    console.log(req.file);
    const id = req.params.id;
    const userImage = req.file.path.replace(/\\/g,"/");
    await User.findByIdAndUpdate(id, {$set: {
        'userImage': userImage
    }})
    res.json({
        success: true, msg: 'Success Uploads'
    })
};
module.exports = userCtrl;