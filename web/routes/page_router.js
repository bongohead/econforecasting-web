// @ts-nocheck
import { Router } from 'express';
import { concat_js } from '../middleware.js';
let page_router = Router();


const basic_routes = [
  {
    title: 'Macropredictions',
    canonical: 'https://macropredictions.com',
    description: 'Open datasets for macroeconomic time series, financial forecasts, and other economic data.',
    keywords: 'treasury yields, treasury yield forecasts, macroeconomic forecasts, interest rate forecasts, 10 year treasury yield forecast, rate forecasts, economic forecasts',
    template: 'home', jsname: 'home', endpoints: ['/'],  js: ['home'], externaljs: ['hc/highstock', 'lottie/lottie-player', 'autocomplete/autoComplete']
  }, {
    jsname: 'forecast-treasury-curve', endpoints: ['/forecast-treasury-curve'],
    js: ['forecast-treasury-curve'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5', 'dt/dataTables.responsive'],
    template: 'forecast-treasury-curve', title: 'Treasury Curve Forecast', canonical: 'https://dev1.econscale.com/forecast-treasury-curve',
  }, {
    jsname: 'forecast-t01m', endpoints: ['/forecast-t01m'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '1-Month Treasury Bill Forecasts', canonical: 'https://macropredictions.com/forecast-t01m',
    varname: 't01m', primary_forecast: 'int', secondary_forecasts: []
  }, {
    jsname: 'forecast-t02m', endpoints: ['/forecast-t02m'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '2-Month Treasury Bill Forecasts', canonical: 'https://econforecasting.com/forecast-t02m',
    varname: 't02m', primary_forecast: 'int', secondary_forecasts: []
  }, {
    jsname: 'forecast-t03m', endpoints: ['/forecast-t03m'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '3-Month Treasury Bill Forecasts', canonical: 'https://econforecasting.com/forecast-t03m',
    varname: 't03m', primary_forecast: 'int', secondary_forecasts: ['cbo', 'spf']
  }, {
    jsname: 'forecast-t06m', endpoints: ['/forecast-t06m'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '6-Month Treasury Bill Forecasts', canonical: 'https://econforecasting.com/forecast-t06m',
    varname: 't06m', primary_forecast: 'int', secondary_forecasts: []
  }, {
    jsname: 'forecast-t01y', endpoints: ['/forecast-t01y'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '1-Year Treasury Note Forecasts', canonical: 'https://econforecasting.com/forecast-t01y',
    varname: 't01y', primary_forecast: 'int', secondary_forecasts: ['fnma']
  }, {
    jsname: 'forecast-t02y', endpoints: ['/forecast-t02y'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '2-Year Treasury Note Forecasts', canonical: 'https://econforecasting.com/forecast-t02y',
    varname: 't02y', primary_forecast: 'int', secondary_forecasts: []
  }, {
    jsname: 'forecast-t05y', endpoints: ['/forecast-t05y'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '5-Year Treasury Note Forecasts', canonical: 'https://econforecasting.com/forecast-t05y',
    varname: 't05y', primary_forecast: 'int', secondary_forecasts: []
  }, {
    jsname: 'forecast-t10y', endpoints: ['/forecast-t10y'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '10-Year Treasury Bond Forecasts', canonical: 'https://econforecasting.com/forecast-t10y',
    varname: 't10y', primary_forecast: 'int', secondary_forecasts: ['wsj', 'fnma', 'cbo', 'spf']
  }, {
    jsname: 'forecast-t20y', endpoints: ['/forecast-t20y'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '20-Year Treasury Bond Forecasts', canonical: 'https://econforecasting.com/forecast-t20y',
    varname: 't20y', primary_forecast: 'int', secondary_forecasts: []
  }, {
    jsname: 'forecast-t30y', endpoints: ['/forecast-t30y'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '30-Year Treasury Bond Forecasts', canonical: 'https://econforecasting.com/forecast-t30y',
    varname: 't30y', primary_forecast: 'int', secondary_forecasts: [],
    description: 'View and download macroeconomic forecasts for the 10-year Treasury yield.',
    keywords: 'treasury yields, treasury yield forecasts, macroeconomic forecasts, interest rate forecasts, 10 year treasury yield forecast, 30 year treasury yield forecast, 30-year treasury yield'
  // -----------
  }, {
    jsname: 'forecast-sofr', endpoints: ['/forecast-sofr'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'SOFR Forecasts', canonical: 'https://econforecasting.com/forecast-sofr',
    varname: 'sofr', primary_forecast: 'int', secondary_forecasts: []
  }, {
    jsname: 'forecast-ffr', endpoints: ['/forecast-ffr'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'Federal Funds Forecast', canonical: 'https://econforecasting.com/forecast-ffr',
    varname: 'ffr', primary_forecast: 'int', secondary_forecasts: ['cbo', 'fnma', 'cb', 'wsj']
  }, {
    jsname: 'forecast-ameribor', endpoints: ['/forecast-ameribor'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'AMERIBOR Forecast', canonical: 'https://econforecasting.com/forecast-ffr',
    varname: 'ameribor', primary_forecast: 'int', secondary_forecasts: []
  }, {
    jsname: 'forecast-bsby', endpoints: ['/forecast-bsby'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'BSBY Forecast', canonical: 'https://econforecasting.com/forecast-bsby',
    varname: 'bsby', primary_forecast: 'int', secondary_forecasts: []
  }, {
    jsname: 'forecast-sonia', endpoints: ['/forecast-sonia'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'Sterling Overnight Index (SONIA) Forecast', canonical: 'https://econforecasting.com/forecast-sonia',
    varname: 'sonia', primary_forecast: 'int', secondary_forecasts: []
  }, {
    jsname: 'forecast-estr', endpoints: ['/forecast-estr'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'Euro Short-Term Rate (€STR) Forecast', canonical: 'https://econforecasting.com/forecast-estr',
    varname: 'bsby', primary_forecast: 'int', secondary_forecasts: []
  }, {
    jsname: 'forecast-ukbankrate', endpoints: ['/forecast-ukbankrate'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'UK Bank Rate Forecast', canonical: 'https://econforecasting.com/forecast-ukbankrate',
    varname: 'ukbankrate', primary_forecast: 'int', secondary_forecasts: []
  }, {
    jsname: 'forecast-mort15y', endpoints: ['/forecast-mort15y'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '15-Year US Mortgage Rate Forecast', canonical: 'https://econforecasting.com/forecast-mort15y',
    varname: 'mort15y', primary_forecast: 'int', secondary_forecasts: []
  }, {
    jsname: 'forecast-mort30y', endpoints: ['/forecast-mort30y'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '30-Year US Mortgage Rate Forecast', canonical: 'https://econforecasting.com/forecast-mort30y',
    varname: 'mort30y', primary_forecast: 'int', secondary_forecasts: []
  }, {
    jsname: 'forecast-gdp', endpoints: ['/forecast-gdp'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-macro', title: 'US Real GDP Forecast', canonical: 'https://econforecasting.com/forecast-gdp',
    varname: 'gdp', primary_forecast: 'comp', secondary_forecasts: []
  }, {
    jsname: 'forecast-pce', endpoints: ['/forecast-pce'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-macro', title: 'US Real Consumption Forecast', canonical: 'https://econforecasting.com/forecast-pce',
    varname: 'pce', primary_forecast: 'comp', secondary_forecasts: []
  }, {
    jsname: 'forecast-pdi', endpoints: ['/forecast-pdi'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-macro', title: 'US Real Private Domestic Investment Forecast', canonical: 'https://econforecasting.com/forecast-pce',
    varname: 'pdi', primary_forecast: 'comp', secondary_forecasts: []
  }, {
    jsname: 'forecast-cpi', endpoints: ['/forecast-cpi'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-macro', title: 'US Inflation Forecast', canonical: 'https://econforecasting.com/forecast-cpi',
    varname: 'cpi', primary_forecast: 'einf', secondary_forecasts: []
  }, {
    jsname: 'nowcast-gdp', endpoints: ['/nowcast-gdp'],
    js: ['nowcast-gdp'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'nowcast-gdp', title: 'GDP Nowcast'
  }
];


// Set basic routes
basic_routes.forEach(function(r) {

  const libs =
    ['jquery/jquery', 'bootstrap/bootstrap', 'gradient/gradient', 'dayjs/dayjs', 'dayjs/timezone', 'dayjs/utc', 'dayjs/minmax', 'dayjs/advancedformat'].concat(r.externaljs).map(f => `libs/${f}`)
    .concat(['helpers'])
    .concat(r.js);

  page_router.get(r.endpoints, concat_js(`${r.jsname}.js`, libs), (req, res, next) => {
    
    try {
      res.render(
        `./${r.template}.html.twig`,
        {
          title: r.title + ' | Macropredictions.com',
          description: r.description ?? '',
          keywords: r.keywords ?? '',
          canonical: r.canonical,
          pagescript: `${r.jsname}.js`,
          // Optional attributes
          varname: r.varname ?? null,
          primary_forecast: r.primary_forecast ?? null,
          secondary_forecasts: r.secondary_forecasts ?? null
        }
      );
    } catch(err) {
      next(err);
    }
  });

})


export default page_router;