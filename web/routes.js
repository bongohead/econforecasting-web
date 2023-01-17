const router = require('express').Router();
const concatJs = require('./middleware').concatJs;

/* GET home page. */
const routes = [
  {
    name: 'home', endpoints: ['/'],
    js: ['home'], externaljs: [],
    template: 'home', title: 'Econforecasting.com'
  }, {
      name: 'forecast-treasury-curve', endpoints: ['/forecast-treasury-curve'],
      js: ['helpers', 'forecast-treasury-curve'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5', 'dt/dataTables.responsive'],
      template: 'forecast-treasury-curve', title: 'Treasury Curve Forecast', canonical: 'https://dev1.econscale.com/forecast-treasury-curve',
  }, {
    name: 'forecast-t01m', endpoints: ['/forecast-t01m'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '1-Month Treasury Bill Forecasts', canonical: 'https://econforecasting.com/forecast-t01m',
    varname: 't01m', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-t02m', endpoints: ['/forecast-t02m'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '2-Month Treasury Bill Forecasts', canonical: 'https://econforecasting.com/forecast-t02m',
    varname: 't02m', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-t03m', endpoints: ['/forecast-t03m'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '3-Month Treasury Bill Forecasts', canonical: 'https://econforecasting.com/forecast-t03m',
    varname: 't03m', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-t06m', endpoints: ['/forecast-t06m'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '6-Month Treasury Bill Forecasts', canonical: 'https://econforecasting.com/forecast-t06m',
    varname: 't06m', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-t01y', endpoints: ['/forecast-t01y'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '1-Year Treasury Note Forecasts', canonical: 'https://econforecasting.com/forecast-t01y',
    varname: 't01y', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-t02y', endpoints: ['/forecast-t02y'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '2-Year Treasury Note Forecasts', canonical: 'https://econforecasting.com/forecast-t02y',
    varname: 't02y', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-t05y', endpoints: ['/forecast-t05y'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '5-Year Treasury Note Forecasts', canonical: 'https://econforecasting.com/forecast-t05y',
    varname: 't05y', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-t10y', endpoints: ['/forecast-t10y'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '10-Year Treasury Bond Forecasts', canonical: 'https://econforecasting.com/forecast-t10y',
    varname: 't10y', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-t20y', endpoints: ['/forecast-t20y'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '20-Year Treasury Bond Forecasts', canonical: 'https://econforecasting.com/forecast-t20y',
    varname: 't20y', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-t30y', endpoints: ['/forecast-t30y'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '30-Year Treasury Bond Forecasts', canonical: 'https://econforecasting.com/forecast-t30y',
    varname: 't30y', primary_forecast: 'int', secondary_forecasts: []
  // -----------
  }, {
    name: 'forecast-sofr', endpoints: ['/forecast-sofr'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'SOFR Forecasts', canonical: 'https://econforecasting.com/forecast-sofr',
    varname: 'sofr', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-ffr', endpoints: ['/forecast-ffr'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'Federal Funds Forecast', canonical: 'https://econforecasting.com/forecast-ffr',
    varname: 'ffr', primary_forecast: 'int', secondary_forecasts: ['cbo', 'fnma', 'cb', 'wsj']
  }, {
    name: 'forecast-ameribor', endpoints: ['/forecast-ameribor'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'AMERIBOR Forecast', canonical: 'https://econforecasting.com/forecast-ffr',
    varname: 'ameribor', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-bsby', endpoints: ['/forecast-bsby'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'BSBY Forecast', canonical: 'https://econforecasting.com/forecast-bsby',
    varname: 'bsby', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-sonia', endpoints: ['/forecast-sonia'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'Sterling Overnight Index (SONIA) Forecast', canonical: 'https://econforecasting.com/forecast-sonia',
    varname: 'sonia', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-estr', endpoints: ['/forecast-estr'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'Euro Short-Term Rate (€STR) Forecast', canonical: 'https://econforecasting.com/forecast-estr',
    varname: 'bsby', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-ukbankrate', endpoints: ['/forecast-ukbankrate'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'UK Bank Rate Forecast', canonical: 'https://econforecasting.com/forecast-ukbankrate',
    varname: 'ukbankrate', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-mort15y', endpoints: ['/forecast-mort15y'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '15-Year US Mortgage Rate Forecast', canonical: 'https://econforecasting.com/forecast-mort15y',
    varname: 'mort15y', primary_forecast: 'int', secondary_forecasts: []
  }, {
    name: 'forecast-mort30y', endpoints: ['/forecast-mort30y'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: '30-Year US Mortgage Rate Forecast', canonical: 'https://econforecasting.com/forecast-mort30y',
    varname: 'mort30y', primary_forecast: 'int', secondary_forecasts: []

  }
];

routes.forEach(r => {

  const libs =
    ['jquery', 'bootstrap', 'gradient', 'dayjs/dayjs', 'dayjs/timezone', 'dayjs/utc', 'dayjs/minmax', 'dayjs/advancedformat'].concat(r.externaljs).map(f => `libs/${f}`)
    .concat(['helpers']).concat(r.js);

  router.get(r.endpoints, concatJs(`${r.name}.js`, libs), (req, res) => {
    /*
    const path = require('path');
    require('esbuild').buildSync({
      nodePaths: [path.join(__dirname, 'node_modules')],
      entryPoints: [path.join(__dirname, '/../js/' + 'forecast-varname' + '.js')],
      bundle: true,
      platform: 'browser',
      minify: true,
      format: 'esm',
      outfile: path.join(__dirname, '/cache/' + 'forecast-ffr' + '.js')
    });
    */
    res.render(
      `./${r.template}.html.twig`,
      {
        name: r.name, title: r.title + ' | econforecasting.com',
        canonical: r.canonical,
        pagescript: `${r.name}.js`,
        // Optional attributes
        varname: r.varname ?? null,
        primary_forecast: r.primary_forecast ?? null,
        secondary_forecasts: r.secondary_forecasts ?? null
      }
    );
  });
  


})

// ['template' => 'forecast-rates', 'request' => ['forecast-sofr', 'fc-rates-sofr'], 'canonical' => 'https://econforecasting.com/forecast-sofr', 'title' => 'SOFR Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the SOFR rate using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
// ['template' => 'forecast-rates', 'request' => ['forecast-ffr', 'fc-rates-ffr'], 'canonical' => 'https://econforecasting.com/forecast-ffr', 'title' => 'FFR Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the federal funds rate using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
// ['template' => 'forecast-rates', 'request' => ['forecast-bsby'], 'title' => 'BSBY Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the Bloomberg short-term rate rate using a futures market driven forecast model.', 'models' => [],  'js' => ['init', 'forecast-varname']],
// ['template' => 'forecast-rates', 'request' => ['forecast-ameribor'], 'title' => 'AMERIBOR Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the AMERIBOR rate using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
// ['template' => 'forecast-rates', 'request' => ['forecast-mort30y'], 'title' => '30-Year Mortgage Rate Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'We provide monthly forecasts of the 30-year U.S. fixed-rate mortgage rate using a quantitatively driven model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
// ['template' => 'forecast-rates', 'request' => ['forecast-mort15y'], 'title' => '15-Year Mortgage Rate | Economic Forecasts | econforecasting.com', 'description' => 'We provide monthly forecasts of the 15-year U.S. fixed-rate mortgage rate using a quantitatively driven model.', 'models' => [], 'js' => ['init', 'forecast-varname']],


module.exports = router;
