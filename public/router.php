<?php

foreach (glob('/var/www/web-framework/php-files/*.php') as $filename) {
    require_once($filename);
}


if (isset($_POST) && isset($_POST['isAjax'])) {
	routeAjax(
		$postVars = $_POST,
		$modelsDir = __DIR__.'/../php-models',
		$db = 'ef'
	);
} else {
	routePage(
		$templatesDir = __DIR__.'/templates',
		$templatesCacheDir = __DIR__.'/cache',
		$modelsDir = __DIR__.'/../php-models',
		$toScript = [],
		$jsDir = __DIR__.'/../js',
		$routes = [
			['template' => 'home', 'request' => ['', 'home'], 'title' => 'The Center for Macroeconomic Forecasting & Insights', 'models' => [], 'js' => ['init']],
			['template' => 'ac-assets', 'request' => ['ac-assets'], 'title' => 'Asset Cross-Correlation Index', 'models' => [], 'js' => ['init', 'ac-assets']],
			['template' => 'ac-assets-hm', 'request' => ['ac-assets-hm'], 'title' => 'Asset Cross-Correlation', 'models' => [], 'js' => ['init', 'ac-assets-hm']],
			['template' => 'ac-regions', 'request' => ['ac-regions'], 'title' => 'Regional Cross-Correlation Index', 'models' => [], 'js' => ['init', 'ac-regions']],
			['template' => 'ac-regions-hm', 'request' => ['ac-regions-hm'], 'title' => 'Regional Cross-Correlation', 'models' => [], 'js' => ['init', 'ac-regions-hm']],
			['template' => 'fc-rates-t', 'request' => ['fc-rates-t-3m', 'fc-rates-t-6m', 'fc-rates-t-1y', 'fc-rates-t-2y', 'fc-rates-t-5y', 'fc-rates-t-10y', 'fc-rates-t-20y', 'fc-rates-t-30y'], 'title' => 'Treasury Yield Economic Forecasts', 'models' => [], 'js' => ['init', 'fc-rates-t']],
			['template' => 'fc-rates-ffr', 'request' => ['fc-rates-ffr'], 'title' => 'Federal Funds Rate Forecasts', 'models' => [], 'js' => ['init', '']],
			['template' => 'fc-rates-desc', 'request' => ['fc-rates-desc'], 'title' => 'CMEFI Rate Forecast Model', 'models' => [], 'js' => ['init', '']],
		],
		$errorRoute = ['template' => 'error', 'request' => 'error', 'title' => 'Error', 'js' => []],
		$baseJsFiles = ['functions', 'moment.min'],
		$devMode = TRUE,
		$db = 'ef'
	);
}