const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
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