const router = require('express').Router();
const concatJs = require('./middleware').concatJs;

/* GET home page. */
const routes = [
  {
    name: 'home', endpoints: ['/'],
    js: ['init'], externaljs: [],
    template: 'home', title: 'Home'
  }, {
    name: 'forecast-sofr', endpoints: ['/forecast-sofr'],
    js: ['init', 'helpers', 'forecast-varname'], externaljs: ['moment', 'moment-tz', 'gradient'],
    template: 'forecast-rates', canonical: 'https://econforecasting.com/forecast-sofr'
  }, {
    name: 'forecast-ffr', endpoints: ['/forecast-ffr'],
    js: ['init', 'helpers', 'forecast-varname'], externaljs: ['moment', 'moment-tz', 'gradient'],
    template: 'forecast-rates', canonical: 'https://econforecasting.com/forecast-ffr'
  }
];

routes.forEach(r => {

  router.get(r.endpoints, concatJs(`${r.name}.js`, r.js.concat(r.externaljs.map(f => `libs/${f}`))), (req, res) => {
    res.render(
      `./${r.template}.html.twig`,
      {title: r.title + ' | Economic Forecasts | econforecasting.com', canonical: r.canonical, pagescript: `${r.name}.js`}
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
