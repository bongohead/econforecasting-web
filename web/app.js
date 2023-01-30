require('dotenv').config({path: './../.env'})
const port = process.env.NODE_PORT;
const path = require('path');

const express = require('express');
const compression = require('compression');

// Middlewares
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const { rateLimiter, cookieSetter } = require('./middleware');

const pageRouter = require('./routes');

const app = express();
app.listen(port, 300);

// Use Helmet to define headers for sec
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com'],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net', 'https://cdn.datatables.net', 'https://code.highcharts.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net', 'https://cdn.datatables.net', 'https://code.highcharts.com', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
            fontSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://fonts.googelapis.com', 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
            connectSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://*.econforecasting.com', 'https://*.econscale.com']
          }
    }
}));

// Enable CORS for all routes
const allowlist = ['https://dev1.econscale.com', 'https://dev.econscale.com', 'https://econforecasting.com', 'https://www.econforecasting.com']
const corsOptionsDelegate = function (req, callback) {
  const origin = (allowlist.indexOf(req.header('Origin')) !== -1) ? true : false;
  const corsOptions = {
    origin: origin,
    maxAge: 600
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate));

// Use body-parser as middleware to decode POST content
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Use rate limiter
app.use(rateLimiter);
app.use(cookieSetter);

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/static/cache', express.static(path.join(__dirname, 'cache')));
app.use('/robots.txt', express.static(path.join(__dirname, 'static', 'robots.txt')));
app.use('/sitemap.xml', express.static(path.join(__dirname, 'static', 'sitemap.xml')));

// Compress files
app.use(compression());


// Set templating engine for page views
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'twig');
// This section is optional and used to configure twig.
app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false
});

app.use('/', pageRouter);

module.exports = app;
