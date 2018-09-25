const express = require('express');
const router = express.Router();
const passport = require('passport');

const user = require('../controllers/user.controller');
//Register
router.post('/register', user.Register);

//Auth
router.post('/authenticate', user.Auth);
//Profile
router.get('/profile', passport.authenticate('jwt', {session: false}) , user.Profile);


module.exports = router;