const router = require('express').Router();
const concatJs = require('./middleware').concatJs;

/* GET home page. */
const routes = [
  {
    name: 'home', endpoints: ['/'],
    js: ['home'], externaljs: [],
    template: 'home', title: 'Econforecasting.com'
  }, {
    name: 'forecast-sofr', endpoints: ['/forecast-sofr'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'SOFR Forecasts', canonical: 'https://econforecasting.com/forecast-sofr'
  }, {
    name: 'forecast-ffr', endpoints: ['/forecast-ffr'],
    js: ['forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'Federal Funds Forecast', canonical: 'https://econforecasting.com/forecast-ffr'
  }, {
    name: 'forecast-ameribor', endpoints: ['/forecast-ameribor'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'AMERIBOR Forecast', canonical: 'https://econforecasting.com/forecast-ffr'
  }, {
    name: 'forecast-bsby', endpoints: ['/forecast-bsby'],
    js: ['helpers', 'forecast-varname'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-rates', title: 'BSBY Forecast', canonical: 'https://econforecasting.com/forecast-ffr'
  }, {
    name: 'forecast-treasury-curve', endpoints: ['/forecast-treasury-curve'],
    js: ['helpers', 'forecast-treasury-curve'], externaljs: ['hc/highstock', 'hc/highcharts-more', 'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5'],
    template: 'forecast-treasury-curve', title: 'Treasury Curve Forecast', canonical: 'https://dev1.econscale.com/forecast-treasury-curve'
  }
];

routes.forEach(r => {

  const libs =
    ['jquery', 'bootstrap', 'gradient', 'dayjs/dayjs', 'dayjs/timezone', 'dayjs/utc', 'dayjs/minmax'].concat(r.externaljs).map(f => `libs/${f}`)
    .concat(['helpers']).concat(r.js);

  router.get(r.endpoints, concatJs(`${r.name}.js`, libs), (req, res) => {
    res.render(
      `./${r.template}.html.twig`,
      {title: r.title + ' | econforecasting.com', canonical: r.canonical, pagescript: `${r.name}.js`}
    );
  });
  
  /*
  router.get(r.endpoints, (req, res) => {
    if (process.env.NODE_ENV === 'development') {
      const path = require('path');

      require('esbuild').buildSync({
        entryPoints: [path.join(__dirname, '/../js/' + r.name + '.js')],
        bundle: true,
        minify: false,
        outfile: path.join(__dirname, '/cache/' + r.name + '.js')
      })
    }
    res.render(
      `./${r.template}.html.twig`,
      {title: r.title + ' | econforecasting.com', canonical: r.canonical, pagescript: `${r.name}.js`}
    );
  */


})

// ['template' => 'forecast-rates', 'request' => ['forecast-sofr', 'fc-rates-sofr'], 'canonical' => 'https://econforecasting.com/forecast-sofr', 'title' => 'SOFR Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the SOFR rate using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
// ['template' => 'forecast-rates', 'request' => ['forecast-ffr', 'fc-rates-ffr'], 'canonical' => 'https://econforecasting.com/forecast-ffr', 'title' => 'FFR Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the federal funds rate using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
// ['template' => 'forecast-rates', 'request' => ['forecast-bsby'], 'title' => 'BSBY Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the Bloomberg short-term rate rate using a futures market driven forecast model.', 'models' => [],  'js' => ['init', 'forecast-varname']],
// ['template' => 'forecast-rates', 'request' => ['forecast-ameribor'], 'title' => 'AMERIBOR Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the AMERIBOR rate using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
// ['template' => 'forecast-rates', 'request' => ['forecast-mort30y'], 'title' => '30-Year Mortgage Rate Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'We provide monthly forecasts of the 30-year U.S. fixed-rate mortgage rate using a quantitatively driven model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
// ['template' => 'forecast-rates', 'request' => ['forecast-mort15y'], 'title' => '15-Year Mortgage Rate | Economic Forecasts | econforecasting.com', 'description' => 'We provide monthly forecasts of the 15-year U.S. fixed-rate mortgage rate using a quantitatively driven model.', 'models' => [], 'js' => ['init', 'forecast-varname']],


module.exports = router;
