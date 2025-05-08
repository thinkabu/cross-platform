// Khai báo các thư viện cần thiết
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const dotenv = require('dotenv');

// Khai báo routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var location_v2Router = require('./routes/locationv2');
var locationRouter = require('./routes/location');
var directionRouter = require('./routes/direction');
const interestRouter = require('./routes/interest');
const travelAIRouter = require('./routes/travel_AI');

const { default: mongoose } = require('mongoose');
const { error } = require('console');

// App setup
const app = express();
dotenv.config();

const cors = require('cors');
app.use(cors());

// const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URI

// ket noi db
mongoose.connect(MONGOURL)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => console.error("❌ MongoDB Atlas connection error:", err));



// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// routers
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/location', locationRouter);
app.use('/api/location2', location_v2Router);
app.use('/api/direction', directionRouter);
app.use('/api/interests', interestRouter);
app.use('/api/travel_ai', travelAIRouter);

module.exports = app;
