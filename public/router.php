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
			['template' => 'fc-rates-t', 'request' => ['fc-rates-t-3m', 'fc-rates-t-6m', 'fc-rates-t-1y', 'fc-rates-t-2y', 'fc-rates-t-5y', 'fc-rates-t-10y', 'fc-rates-t-20y', 'fc-rates-t-30y'], 'title' => 'Treasury Yield Economic Forecasts', 'models' => [], 'js' => ['init', 'fc-rates-t']],
			['template' => 'fc-rates-tcurve', 'request' => ['fc-rates-tcurve'], 'title' => 'Treasury Yield Curve Forecasts | Center for Macroeconomic Forecasting & Insights', 'models' => [], 'js' => ['init', 'fc-rates-tcurve']],
			['template' => 'fc-rates-t-info', 'request' => ['fc-rates-t-info'], 'title' => 'Treasury Yield Curve Forecast Model | Center for Macroeconomic Forecasting & Insights', 'models' => [], 'js' => ['init', 'fc-rates-t-info']],
			['template' => 'fc-rates-other', 'request' => ['fc-rates-ffr', 'fc-rates-sofr', 'fc-rates-mort30y', 'fc-rates-mort15y', 'fc-rates-inf'], 'title' => 'Federal Funds Rate Forecasts', 'models' => [], 'js' => ['init', 'fc-rates-other']],
			['template' => 'fc-macro-other', 'request' => ['fc-macro-inf'], 'title' => 'Macroeconomic Indicator Forecasts', 'models' => [], 'js' => ['init', 'fc-rates-other']],
			['template' => 'nc-gdp', 'request' => ['nc-gdp'], 'title' => 'GDP Nowcasts | Center for Macroeconomic Forecasts & Insights', 'models' => [], 'js' => ['init', 'nc-gdp']],
			['template' => 'blog', 'request' => 'blog', 'title' => 'The Center for Macroeconomic Forecasts & Insights', 'models' => [], 'js' => []],
			['template' => 'forecasts', 'request' => ['forecasts'], 'title' => 'Forecasts | CMEFI', 'models' => [], 'js' => ['init', 'forecasts']],

			['template' => 'csm-forecasts', 'request' => ['csm-forecasts'], 'title' => 'Forecasts | CMEFI', 'models' => [], 'js' => ['init', 'csm-forecasts']],
			
			['template' => 'home', 'request' => ['', 'home'], 'title' => 'The Center for Macroeconomic Forecasting & Insights | CMEFI', 'models' => [], 'js' => ['init', 'home']],
			['template' => 'rates-model-sofr', 'request' => ['rates-model-sofr'], 'title' => 'SOFR Forecasts | CMEFI', 'models' => [], 'js' => ['init', 'rates-model-sofr']],
			['template' => 'rates-model-ffr', 'request' => ['rates-model-ffr'], 'title' => 'Federal Funds Rate Forecasts | CMEFI', 'models' => [], 'js' => ['init', 'rates-model-ffr']],
			['template' => 'rates-model-treasury', 'request' => ['rates-model-treasury-3m'], 'title' => '3 Month Treasury Yield Forecast | CMEFI', 'models' => [], 'js' => ['init', 'rates-model-treasury']],
			['template' => 'rates-model-treasury', 'request' => ['rates-model-treasury-6m'], 'title' => '6 Month Treasury Yield Forecast | CMEFI', 'models' => [], 'js' => ['init', 'rates-model-treasury']],
			['template' => 'rates-model-treasury', 'request' => ['rates-model-treasury-1y'], 'title' => '1 Year Treasury Yield Forecast | CMEFI', 'models' => [], 'js' => ['init', 'rates-model-treasury']],
			['template' => 'rates-model-treasury', 'request' => ['rates-model-treasury-2y'], 'title' => '2 Year Treasury Yield Forecast | CMEFI', 'models' => [], 'js' => ['init', 'rates-model-treasury']],
			['template' => 'rates-model-treasury', 'request' => ['rates-model-treasury-5y'], 'title' => '5 Year Treasury Yield Forecast | CMEFI', 'models' => [], 'js' => ['init', 'rates-model-treasury']],
			['template' => 'rates-model-treasury', 'request' => ['rates-model-treasury-10y'], 'title' => '10 Year Treasury Yield Forecast | CMEFI', 'models' => [], 'js' => ['init', 'rates-model-treasury']],
			['template' => 'rates-model-treasury', 'request' => ['rates-model-treasury-20y'], 'title' => '20 Year Treasury Yield Forecast | CMEFI', 'models' => [], 'js' => ['init', 'rates-model-treasury']],
			['template' => 'rates-model-treasury', 'request' => ['rates-model-treasury-30y'], 'title' => '30 Year Treasury Yield Forecast | CMEFI', 'models' => [], 'js' => ['init', 'rates-model-treasury']],
		],
		errorRoute: ['template' => 'error', 'request' => 'error', 'title' => 'Error', 'js' => []],
		baseJsFiles: ['functions', 'moment.min', 'moment-timezone-with-data-1970-2030.min', 'gradient-min'],
		devMode: true,// ($_SERVER['REMOTE_ADDR'] === '24.42.246.68') ? true : false,
		db: 'cmefi'
	);
}