<?php

foreach (glob('/var/www/web-framework/php-files/*.php') as $filename) {
    require_once($filename);
}

if (isset($_POST) && isset($_POST['isAjax'])) {
	routeAjax(
		$postVars = $_POST,
		$modelsDir = __DIR__.'/../sql',
		$db = 'cmefi'
	);
} else {
	routePage(
		templatesDir: __DIR__.'/templates',
		templatesCacheDir: __DIR__.'/cache',
		modelsDir: __DIR__.'/../sql',
		toScript: [],
		jsDir: __DIR__.'/../js',
		routes: [
			['template' => 'ac-assets', 'request' => ['ac-assets'], 'title' => 'Asset Cross-Correlation Index | Center for Macroeconomic Forecasting & Insights', 'models' => [], 'js' => ['init', 'ac-assets']],
			['template' => 'ac-assets-hm', 'request' => ['ac-assets-hm'], 'title' => 'Asset Cross-Correlation | Center for Macroeconomic Forecasting & Insights', 'models' => [], 'js' => ['init', 'ac-assets-hm']],
			['template' => 'ac-regions', 'request' => ['ac-regions'], 'title' => 'Regional Cross-Correlation Index | Center for Macroeconomic Forecasting & Insights', 'models' => [], 'js' => ['init', 'ac-regions']],
			['template' => 'ac-regions-hm', 'request' => ['ac-regions-hm'], 'title' => 'Treasury Yield Forecasts | Center for Macroeconomic Forecasting & Insights', 'models' => [], 'js' => ['init', 'ac-regions-hm']],
			['template' => 'fc-macro-other', 'request' => ['fc-macro-inf'], 'title' => 'Macroeconomic Indicator Forecasts', 'models' => [], 'js' => ['init', 'fc-rates-other']],
			['template' => 'blog', 'request' => 'blog', 'title' => 'The Center for Macroeconomic Forecasts & Insights', 'models' => [], 'js' => []],
			['template' => 'forecasts', 'request' => ['forecasts'], 'title' => 'Forecasts | CMEFI', 'models' => [], 'js' => ['init', 'forecasts']],

			['template' => 'csm-forecasts', 'request' => ['csm-forecasts'], 'title' => 'Forecasts | econforecasting.com', 'models' => [], 'js' => ['init', 'csm-forecasts']],
			
			['template' => 'home', 'request' => ['', 'home'], 'title' => 'The Center for Macroeconomic Forecasting & Insights | econforecasting.com', 'models' => [], 'js' => ['init', 'home']],
			
			['template' => 'forecast-benchmark-rates', 'request' => ['forecast-sofr'], 'title' => 'SOFR Forecasts | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-benchmark-rates']],
			['template' => 'forecast-benchmark-rates', 'request' => ['forecast-ffr'], 'title' => 'FFR Forecasts | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-benchmark-rates']],
			['template' => 'forecast-benchmark-rates', 'request' => ['forecast-bsby'], 'title' => 'BSBY Forecasts | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-benchmark-rates']],
			['template' => 'forecast-benchmark-rates', 'request' => ['forecast-ameribor'], 'title' => 'AMERIBOR Forecasts | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-benchmark-rates']],
				
			['template' => 'forecast-treasury-summary', 'request' => ['forecast-treasury-summary'], 'title' => 'Yield Forecast Overview | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-treasury-summary']],
			['template' => 'forecast-treasury-curve', 'request' => ['forecast-treasury-curve'], 'title' => 'Treasury Yield Curve Forecasts | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-treasury-curve']],
			['template' => 'forecast-treasury', 'request' => ['forecast-treasury-3m'], 'title' => '3 Month Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-treasury']],
			['template' => 'forecast-treasury', 'request' => ['forecast-treasury-6m'], 'title' => '6 Month Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-treasury']],
			['template' => 'forecast-treasury', 'request' => ['forecast-treasury-1y'], 'title' => '1 Year Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-treasury']],
			['template' => 'forecast-treasury', 'request' => ['forecast-treasury-2y'], 'title' => '2 Year Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-treasury']],
			['template' => 'forecast-treasury', 'request' => ['forecast-treasury-5y'], 'title' => '5 Year Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-treasury']],
			['template' => 'forecast-treasury', 'request' => ['forecast-treasury-10y'], 'title' => '10 Year Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-treasury']],
			['template' => 'forecast-treasury', 'request' => ['forecast-treasury-20y'], 'title' => '20 Year Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-treasury']],
			['template' => 'forecast-treasury', 'request' => ['forecast-treasury-30y'], 'title' => '30 Year Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-treasury']],
			
			['template' => 'forecast-inflation', 'request' => ['forecast-inflation'], 'title' => 'Inflation Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-inflation']],

			['template' => 'nowcast-model-gdp', 'request' => ['nowcast-model-gdp'], 'title' => 'GDP Nowcasts | econforecasting.com', 'models' => [], 'js' => ['init', 'nowcast-model-gdp']],

		],
		errorRoute: ['template' => 'error', 'request' => 'error', 'title' => 'Error', 'js' => []],
		baseJsFiles: ['functions', 'moment.min', 'moment-timezone-with-data-1970-2030.min', 'gradient-min'],
		devMode: true, //($_SERVER['REMOTE_ADDR'] === '108.162.241.101') ? true : false,
		db: 'cmefi'
	);
}
//echo $_SERVER['REMOTE_ADDR'];