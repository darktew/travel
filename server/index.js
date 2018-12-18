const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose  = require('mongoose');
const database = require('./database');

const path = require('path');
const webpush = require('web-push');
const socketIO = require('socket.io');
// Connect to Database
mongoose.connect(database.database)
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));
// Settings
app.set('port', process.env.PORT || 8080);
app.use(function (req,res,next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested, Content-Type, Accept, Authorization, sid");
        res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
        next();
});
// Middlewares
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({origin: 'http://localhost:4200'}));

// Routes
app.use('/api/employees',require('./routes/employee.routes'));
app.use('/api/position',require('./routes/position.routes'));
app.use('/api/jobs',require('./routes/job.routes'));
app.use('/api/users',require('./routes/user.routes'));
app.use('/api/home', require('./routes/home.routes'));
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./passport')(passport);



// Starting the Server
const server = app.listen(app.get('port'), () =>{
    console.log('Server on port 3000');
});

//Seting IO
const io = socketIO.listen(server);
app.set('io',io);
