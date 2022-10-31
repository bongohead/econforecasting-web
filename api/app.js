const express = require("express");

// Middlewares
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimiter = require('./middleware').rateLimiter;
const pageRouter = require('./routes/pages');

const port = 3000;
const path = require('path');



const app = express();
app.listen(port, 300);

// Use Helmet to define headers for sec
app.use(helmet());

// Enable CORS for all routes
app.use(cors());

// Use body-parser as middleware to decode POST content
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false}));

// Parse cookies
app.use(cookieParser());

// Use rate limiter
app.use(rateLimiter)

app.use('/', pageRouter);




module.exports = app;