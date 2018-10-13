const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const date = new Date();
        cb(null, "uploads" +file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('type in correct jpeg and png'), false);
    }
};
const upload = multer(
    {
        storage: storage,
        limits: {
            fieldSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    });
const user = require('../controllers/user.controller');
//Register
router.post('/register', user.Register);
//Edit Profile
router.put('/profile/:id', user.editProfile);
//UploadImage
router.put('/upload/:id', upload.single('image'), user.userImage);
//Auth
router.post('/authenticate', user.Auth);
//Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), user.Profile);


module.exports = router;
