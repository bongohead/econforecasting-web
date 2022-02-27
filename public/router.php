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
			
			['template' => 'forecast-rates', 'request' => ['forecast-sofr'], 'title' => 'SOFR Forecasts | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-rates']],
			['template' => 'forecast-rates', 'request' => ['forecast-ffr'], 'title' => 'FFR Forecasts | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-rates']],
			['template' => 'forecast-rates', 'request' => ['forecast-bsby'], 'title' => 'BSBY Forecasts | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-rates']],
			['template' => 'forecast-rates', 'request' => ['forecast-ameribor'], 'title' => 'AMERIBOR Forecasts | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-rates']],
			['template' => 'forecast-rates', 'request' => ['forecast-mort30y'], 'title' => '30-Year Mortgage Rate Forecasts | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-rates']],
			['template' => 'forecast-rates', 'request' => ['forecast-mort15y'], 'title' => '15-Year Mortgage Rate | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-rates']],

			['template' => 'forecast-treasury-summary', 'request' => ['forecast-treasury-summary'], 'title' => 'Yield Forecast Overview | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-treasury-summary']],
			['template' => 'forecast-treasury-curve', 'request' => ['forecast-treasury-curve'], 'title' => 'Treasury Yield Curve Forecasts | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-treasury-curve']],
			['template' => 'forecast-rates', 'request' => ['forecast-t03m'], 'title' => '3 Month Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-rates']],
			['template' => 'forecast-rates', 'request' => ['forecast-t06m'], 'title' => '6 Month Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-rates']],
			['template' => 'forecast-rates', 'request' => ['forecast-t01y'], 'title' => '1 Year Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-rates']],
			['template' => 'forecast-rates', 'request' => ['forecast-t02y'], 'title' => '2 Year Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-rates']],
			['template' => 'forecast-rates', 'request' => ['forecast-t05y'], 'title' => '5 Year Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-rates']],
			['template' => 'forecast-rates', 'request' => ['forecast-t10y'], 'title' => '10 Year Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-rates']],
			['template' => 'forecast-rates', 'request' => ['forecast-t20y'], 'title' => '20 Year Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-rates']],
			['template' => 'forecast-rates', 'request' => ['forecast-t30y'], 'title' => '30 Year Treasury Yield Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-rates']],
			
			['template' => 'forecast-inflation', 'request' => ['forecast-inflation'], 'title' => 'Inflation Forecast | econforecasting.com', 'models' => [], 'js' => ['init', 'forecast-inflation']],

			['template' => 'nowcast-model-gdp', 'request' => ['nowcast-model-gdp'], 'title' => 'GDP Nowcasts | econforecasting.com', 'models' => [], 'js' => ['init', 'nowcast-model-gdp']],

		],
		errorRoute: ['template' => 'error', 'request' => 'error', 'title' => 'Error', 'js' => []],
		baseJsFiles: ['functions', 'moment.min', 'moment-timezone-with-data-1970-2030.min', 'gradient-min'],
		devMode: true, //($_SERVER['REMOTE_ADDR'] === '50.4.37.141') ? true : false,
		db: 'cmefi'
	);
}
//echo $_SERVER['REMOTE_ADDR'];