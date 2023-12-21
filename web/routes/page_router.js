// @ts-nocheck
import { Router } from 'express';
import { concat_js } from '../middleware.js';
let page_router = Router();


const standard_libs =
    [
      'jquery/jquery',
      'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5',
      'dayjs/dayjs', 'dayjs/timezone', 'dayjs/utc', 'dayjs/minmax', 'dayjs/advancedformat', 'dayjs/quarterofyear',
      'hc/highstock', 'hc/highcharts-more', 'hc/modules/accessibility', 'hc/modules/exporting', 'hc/modules/offline-exporting', 'hc/modules/series-labels',
      'bootstrap/bootstrap', 'gradient/gradient', 
    ].map(f => `libs/${f}`)
    .concat(['helpers'])

const basic_routes = [
  {
    title: 'Macropredictions',
    url: '',
    description: 'Open datasets for macroeconomic time series, financial forecasts, and other economic data.',
    keywords: 'treasury yields, treasury yield forecasts, macroeconomic forecasts, interest rate forecasts, 10 year treasury yield forecast, rate forecasts, economic forecasts',
    template: 'home', endpoints: ['/'], 
    input_js: ['libs/lottie/lottie-player', 'libs/autocomplete/autoComplete'], output_js: 'home'
  }, {
    title: 'Treasury Curve Forecast',
    url: '/treasury-curve',
    description: '10-year monthly forecasts for the Treasury curve.',
    keywords: 'treasury yields, treasury yield forecasts, 10-year treasury yield forecast, 30-year treasury forecast, treasury forecasts',
    template: 'treasury-curve', endpoints: ['/treasury-curve'],  
    input_js: standard_libs.concat(['treasury-curve']), output_js: 'treasury-curve'
  }
];


// Set basic routes
basic_routes.forEach(function(r) {

  page_router.get(r.endpoints, concat_js(`${r.output_js}.js`, r.input_js), (req, res, next) => {
    
    try {
      res.render(`./${r.template}.html.twig`, {
        site: process.env.SITE,
        title: r.title + ' | ' + process.env.SITE +'.com',
        description: r.description,
        keywords: r.keywords,
        canonical: `https://macropredictions.com${r.canonical}`,
        pagescript: `${r.output_js}.js`
      });

    } catch(err) {
      next(err);
    }

  });

})


export default page_router;