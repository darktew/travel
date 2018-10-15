const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    password_check: {
        type: String
    },
    userImage: {
        type: String,
        default: "uploads/download.png"
    },
    address: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id,callback) {
    User.findById(id,callback);
};
module.exports.getUserByUsername = function (username,callback) {
    const query = {username: username};
    User.findOne(query,callback);
};
module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
module.exports.comparePassword = function (condidatePassword , hash , callback) {
    bcrypt.compare(condidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });

}
module.exports.editUser = function (id,editUser, callback) {
    
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(editUser.password, salt, (err,hash) => {
            if (err) throw err;
            editUser.password = hash;
            console.log("editUser in model");
            User.findByIdAndUpdate(id, {$set: editUser}, {new: true}, callback);
        });
    });
}