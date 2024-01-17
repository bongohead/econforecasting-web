import dotenv from 'dotenv';
dotenv.config({path: './../.env'});

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';
import compression from 'compression';

// Middlewares
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import { rate_limiter, cookie_setter, error_handler } from './middleware.js';

import page_router from './routes/page_router.js';
import blog_router from './routes/blog_router.js';
import error_router from './routes/error_router.js';
import forecast_router from './routes/forecast_router.js';
import robot_router from './routes/robot_router.js';

const app = express();
app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`)
});

// Use Helmet to define headers for sec
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            'default-src': ["'self'", 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com', 'https://www.google.com'],
            'script-src': ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net', 'https://cdn.datatables.net', 'https://code.highcharts.com', 'https://plausible.io', 'https://www.google.com', 'https://www.gstatic.com'],
            'script-src-attr': ["'unsafe-inline'"], // Needed for form validation in contact page
            'style-src': ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net', 'https://cdn.datatables.net', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
            'font-src': ["'self'", 'https://cdnjs.cloudflare.com', 'https://fonts.googelapis.com', 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
            'connect-src': ["'self'", 'https://cdnjs.cloudflare.com', 'https://*.econforecasting.com', 'https://*.macropredictions.com', '*'],
            'form-action': ["'self'", 'https://export.highcharts.com'],
            'img-src': ["'self'", 'blob:', 'data:']
          }
    }
}));

// Enable CORS for all routes
const allowlist = [
  'https://econforecasting.com', 'https://www.econforecasting.com', 
  'https://pagead2.googlesyndication.com', 'https://static.cloudflareinsights.com', 
  'https://macropredictions.com', 'https://www.macropredictions.com'
]

const corsOptionsDelegate = function (req, callback) {
  const origin = (allowlist.indexOf(req.header('Origin')) !== -1) ? true : false;
  const corsOptions = {
    origin: origin,
    maxAge: 600
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

// Trust Nginx proxy
app.set('trust proxy', '127.0.0.1');

app.use(cors(corsOptionsDelegate));
// app.use(cors())

// Use body-parser as middleware to decode POST content
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Use rate limiter
app.use(rate_limiter);
app.use(cookie_setter);

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/static/cache', express.static(path.join(__dirname, 'cache')));
// app.use('/robots.txt', express.static(path.join(__dirname, 'static', 'robots.txt')));
// app.use('/sitemap.xml', express.static(path.join(__dirname, 'static', 'sitemap.xml')));

// Compress files
app.use(compression());

// Set templating engine for page views
app.set('views', ('../views'));
app.set('view engine', 'twig');
// This section is optional and used to configure twig.
app.set("twig options", {
  allowAsync: true, // Allow asynchronous compiling - causes potential issues
  strict_variables: true
});

app.use('/', page_router);
app.use('/blog', blog_router);
app.use('/forecast', forecast_router);
app.use('/', robot_router);
app.use('/', error_router);


// Error handlers must come at end
app.use(error_handler);

export default app;