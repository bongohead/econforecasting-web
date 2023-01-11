const router = require('express').Router();
const concatJs = require('./middleware').concatJs;

/* GET home page. */
router.get('/', concatJs('home.js', 'init'), (req, res) => {
  res.render('./home.html.twig', {title: 'Home'});
});

router.get(
  ['/forecast-treasury-curve'],
  concatJs('forecast-treasury-curve.js', ['helpers', 'init', 'forecast-varname', 'libs/moment', 'libs/moment-tz', 'libs/gradient']),
  (req, res) => res.render('./forecast-treasury-curve.html.twig', {
    title: 'Treasury Curve Forecasts | Economic Forecasts | econforecasting.com', canonical: 'https://econforecasting.com/forecast-treasury-curve', pagescript: 'forecast-treasury-curve.js'
  })
);

router.get(
  ['/forecast-sofr'],
  concatJs('forecast-sofr.js', ['helpers', 'init', 'forecast-varname', 'libs/moment', 'libs/moment-tz', 'libs/gradient']),
  (req, res) => res.render('./forecast-rates.html.twig', {
    title: 'SOFR Forecasts | Economic Forecasts | econforecasting.com', canonical: 'https://econforecasting.com/forecast-sofr', pagescript: 'forecast-sofr.js'
  })
);

router.get(
  ['/forecast-ffr'],
  concatJs('forecast-ffr.js', ['helpers', 'init', 'forecast-varname', 'libs/moment', 'libs/moment-tz', 'libs/gradient']),
  (req, res) => res.render('./forecast-rates.html.twig', {
    title: 'Federal Funds Rate Forecasts | Economic Forecasts | econforecasting.com', canonical: 'https://econforecasting.com/forecast-ffr', pagescript: 'forecast-ffr.js'
  })
);


// ['template' => 'forecast-rates', 'request' => ['forecast-sofr', 'fc-rates-sofr'], 'canonical' => 'https://econforecasting.com/forecast-sofr', 'title' => 'SOFR Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the SOFR rate using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
// ['template' => 'forecast-rates', 'request' => ['forecast-ffr', 'fc-rates-ffr'], 'canonical' => 'https://econforecasting.com/forecast-ffr', 'title' => 'FFR Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the federal funds rate using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
// ['template' => 'forecast-rates', 'request' => ['forecast-bsby'], 'title' => 'BSBY Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the Bloomberg short-term rate rate using a futures market driven forecast model.', 'models' => [],  'js' => ['init', 'forecast-varname']],
// ['template' => 'forecast-rates', 'request' => ['forecast-ameribor'], 'title' => 'AMERIBOR Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the AMERIBOR rate using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
// ['template' => 'forecast-rates', 'request' => ['forecast-mort30y'], 'title' => '30-Year Mortgage Rate Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'We provide monthly forecasts of the 30-year U.S. fixed-rate mortgage rate using a quantitatively driven model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
// ['template' => 'forecast-rates', 'request' => ['forecast-mort15y'], 'title' => '15-Year Mortgage Rate | Economic Forecasts | econforecasting.com', 'description' => 'We provide monthly forecasts of the 15-year U.S. fixed-rate mortgage rate using a quantitatively driven model.', 'models' => [], 'js' => ['init', 'forecast-varname']],


module.exports = router;
