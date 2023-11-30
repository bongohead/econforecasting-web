// @ts-nocheck
import { Router } from 'express';
import { concat_js } from '../middleware.js';
let page_router = Router();


const standard_forecast_libs = 
  ['jquery/jquery', 'bootstrap/bootstrap', 'gradient/gradient', 'dayjs/dayjs', 'dayjs/timezone', 'dayjs/utc', 'dayjs/minmax', 'dayjs/advancedformat'].concat(
    ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5', 'dt/dataTables.responsive']
  );

const basic_routes = [
  {
    title: 'Macropredictions',
    canonical: 'https://macropredictions.com',
    description: 'Open datasets for macroeconomic time series, financial forecasts, and other economic data.',
    keywords: 'treasury yields, treasury yield forecasts, macroeconomic forecasts, interest rate forecasts, 10 year treasury yield forecast, rate forecasts, economic forecasts',
    template: 'home', jsname: 'home', endpoints: ['/'],  js: ['home'], externaljs: ['lottie/lottie-player', 'autocomplete/autoComplete'],
    extra_data: {}
  }, {
    title: 'Treasury Curve Forecast',
    canonical: 'https://macropredictions.com/forecast-treasury-curve',
    description: '10-year monthly forecasts for the Treasury curve.',
    keywords: 'treasury yields, treasury yield forecasts, 10-year treasury yield forecast, 30-year treasury forecast, treasury forecasts',
    template: 'forecast-treasury-curve', jsname: 'forecast-treasury-curve', js: ['forecast-treasury-curve'], endpoints: ['/forecast-treasury-curve'],  externaljs: standard_forecast_libs,
    extra_data: {}
  }, {
    title: 'Federal Funds Rate Forecast',
    canonical: 'https://macropredictions.com/forecast-ffr',
    description: '10-year monthly forecasts for the effective federal funds rate.',
    keywords: 'federal funds rate forecasts, ffr forecasts, fed funds forecasts',
    template: 'forecast-rates', jsname: 'forecast-ffr', js: ['forecast-varname'], endpoints: ['/forecast-ffr'],  externaljs: standard_forecast_libs,
    extra_data: {varname: 'ffr', primary_forecast: 'int', secondary_forecasts: ['cbo', 'fnma', 'cb', 'wsj']}
  }
];


// Set basic routes
basic_routes.forEach(function(r) {

  const libs =
    r.externaljs.map(f => `libs/${f}`)
    .concat(['helpers'])
    .concat(r.js);

  page_router.get(r.endpoints, concat_js(`${r.jsname}.js`, libs), (req, res, next) => {
    
    try {
      res.render(`./${r.template}.html.twig`, {
         site: process.env.SITE,
          title: r.title + ' | Macropredictions.com',
          description: r.description ?? '',
          keywords: r.keywords ?? '',
          canonical: r.canonical,
          pagescript: `${r.jsname}.js`,
          extra_data: r.extra_data
      });
    } catch(err) {
      next(err);
    }
  });

})


export default page_router;