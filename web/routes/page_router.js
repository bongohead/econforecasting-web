// @ts-nocheck
import { Router } from 'express';
import { concat_js } from '../middleware.js';
let page_router = Router();


const standard_libs =
    [
      'jquery/jquery',
      'dt/dataTables.min', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5',
      'dayjs/dayjs', 'dayjs/timezone', 'dayjs/utc', 'dayjs/minmax', 'dayjs/advancedformat', 'dayjs/quarterofyear',
      'hc/highstock', 'hc/highcharts-more', 'hc/modules/accessibility', 'hc/modules/exporting', 'hc/modules/offline-exporting', 'hc/modules/series-label',
      'bootstrap/bootstrap', 'gradient/gradient',
    ].map(f => `libs/${f}`)
    .concat(['helpers'])

const basic_routes = [
  {
    title: process.env.TITLE_SITE,
    url: '',
    description: 'Open datasets for macroeconomic time series, financial forecasts, and other economic data.',
    keywords: 'treasury yields, treasury yield forecasts, macroeconomic forecasts, interest rate forecasts, 10 year treasury yield forecast, rate forecasts, economic forecasts, sofr forecasts',
    template: 'home', endpoints: ['/'], 
    input_js: ['libs/lottie/lottie-player', 'libs/autocomplete/autoComplete', 'home', 'libs/bootstrap/bootstrap'], output_js: 'home'
  }, {
    title: 'Contact Us',
    url: '/contact',
    description: 'Reach out to our team! We provide open datasets for macroeconomic time series, financial forecasts, and other economic data.',
    keywords: 'contact us, econforecasting.com contact page, macropredictions.com contact page',
    template: 'contact', endpoints: ['/contact'], 
    input_js: ['libs/lottie/lottie-player','libs/bootstrap/bootstrap', 'helpers', 'contact'], output_js: 'contact'
  }, {
    title: 'About Us',
    url: '/about',
    description: 'Reach out to our team! We provide open datasets for macroeconomic time series, financial forecasts, and other economic data.',
    keywords: 'about us, econforecasting.com about, macropredictions.com about, econforecasting.com',
    template: 'about', endpoints: ['/about'], 
    input_js: ['libs/lottie/lottie-player','libs/bootstrap/bootstrap'], output_js: 'about'
  }, {
    title: 'Treasury Curve Forecast',
    url: '/treasury-curve',
    description: 'Historical data and daily-updated monthly forecasts for the full Treasury yield curve.',
    keywords: 'treasury yields, treasury curve, treasury curve forecasts, treasury yield forecasts, treasury forecasts',
    template: 'treasury-curve', endpoints: ['/treasury-curve'],  
    input_js: standard_libs.concat(['treasury-curve']), output_js: 'treasury-curve'
  }, {
    title: 'Real Treasury Curve Forecast',
    url: '/real-treasury-curve',
    description: 'Historical data and daily-updated monthly forecasts for the TIPS curve and real Treasury yield curve.',
    keywords: 'real treasury yields, real treasury curve, real treasury curve forecasts, real treasury yield forecasts, real treasury forecasts',
    template: 'real-treasury-curve', endpoints: ['/real-treasury-curve'],  
    input_js: standard_libs.concat(['real-treasury-curve']), output_js: 'real-treasury-curve'
  }, 
];


// Set basic routes
basic_routes.forEach(function(r) {

  page_router.get(r.endpoints, concat_js(`${r.output_js}.js`, r.input_js), (req, res, next) => {
    
    try {
      res.render(`./${r.template}.html.twig`, {
        site: process.env.SITE,
        domain: process.env.DOMAIN,
        title: r.title === process.env.TITLE_SITE ? r.title : r.title + ' | ' + process.env.SITE +'.com',
        title_site: process.env.TITLE_SITE, // For home page
        description: r.description,
        keywords: r.keywords,
        canonical: `https://econforecasting.com${r.url}`,
        pagescript: `${r.output_js}.js`,
        recaptcha_key: process.env.RECAPTCHA_KEY
      });

    } catch(err) {
      next(err);
    }

  });

})


export default page_router;