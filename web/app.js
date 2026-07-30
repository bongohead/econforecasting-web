import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import compression from 'compression';
import express from 'express';
import helmet from 'helmet';

import { rate_limiter, cookie_setter, error_handler, pruneJsBundles } from './middleware.js';

import page_router from './routes/page_router.js';
import blog_router from './routes/blog_router.js';
import error_router from './routes/error_router.js';
import forecast_router from './routes/forecast_router.js';
import robot_router from './routes/robot_router.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.dirname(currentDirectory);
dotenv.config({
  path: path.join(projectDirectory, '.env'),
  quiet: true,
});

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 'loopback');
  app.set('views', path.join(projectDirectory, 'views'));
  app.set('view engine', 'twig');
  app.set('twig options', {
    allowAsync: true,
    strict_variables: true,
  });
  app.locals.robots = 'index, follow';

  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'", 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com'],
        'script-src': ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net', 'https://cdn.datatables.net', 'https://code.highcharts.com', 'https://plausible.io'],
        'script-src-attr': ["'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net', 'https://cdn.datatables.net', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
        'font-src': ["'self'", 'https://cdnjs.cloudflare.com', 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
        'connect-src': ["'self'", 'https://*.econforecasting.com', 'https://*.macropredictions.com', 'https://plausible.io'],
        'form-action': ["'self'", 'https://export.highcharts.com'],
        'img-src': ["'self'", 'blob:', 'data:'],
      },
    },
  }));
  app.use(compression());
  app.use(express.json({ limit: '64kb' }));
  app.use(express.urlencoded({ extended: false, limit: '64kb' }));

  // Static requests neither consume the page rate limit nor mint a fresh JWT.
  app.use('/static', express.static(path.join(currentDirectory, 'static')));
  app.use('/static/cache', express.static(path.join(currentDirectory, 'cache')));

  app.use(rate_limiter);
  app.use(cookie_setter);

  app.use('/', page_router);
  app.use('/blog', blog_router);
  app.use('/forecast', forecast_router);
  app.use('/', robot_router);
  app.use('/', error_router);
  app.use(error_handler);

  return app;
}

const app = createApp();

// PM2 imports the script through its process container, so argv-based
// "main module" detection is unreliable. Tests set NODE_ENV=test and start an
// ephemeral listener themselves.
if (process.env.BUILD_ONLY === 'true') {
  pruneJsBundles();
} else if (process.env.NODE_ENV !== 'test') {
  const port = Number(process.env.PORT ?? 3012);
  app.listen(port, '127.0.0.1', (error) => {
    if (error) throw error;
    console.log(`App listening on 127.0.0.1:${port}`);
  });
}

export default app;
