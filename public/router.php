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
			['template' => 'home', 'request' => ['', 'home'], 'title' => 'ECONFORECASTING.COM', 'models' => [], 'js' => ['init']],
			['template' => 'ac-assets', 'request' => ['ac-assets'], 'title' => 'Asset Cross-Correlation Index', 'models' => [], 'js' => ['init', 'ac-assets']],
			['template' => 'ac-assets-hm', 'request' => ['ac-assets-hm'], 'title' => 'Asset Cross-Correlation', 'models' => [], 'js' => ['init', 'ac-assets-hm']],
			['template' => 'ac-regions', 'request' => ['ac-regions'], 'title' => 'Asset Cross-Correlation Index', 'models' => [], 'js' => ['init', 'ac-regions']],
			['template' => 'ac-regions-hm', 'request' => ['ac-regions-hm'], 'title' => 'Regional Cross-Correlation', 'models' => [], 'js' => ['init', 'ac-regions-hm']],
		],
		$errorRoute = ['template' => 'error', 'request' => 'error', 'title' => 'Error', 'js' => []],
		$baseJsFiles = ['functions', 'moment.min'],
		$devMode = TRUE,
		$db = 'ef'
	);
}