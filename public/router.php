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
} else if (isset($_POST) && isset($_POST['isFetch'])) {
	routeFetch(
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
		/*
			['template' => 'ac-assets', 'request' => ['ac-assets'], 'title' => 'Asset Cross-Correlation Index | Center for Macroeconomic Forecasting & Insights', 'models' => [], 'js' => ['init', 'ac-assets']],
			['template' => 'ac-assets-hm', 'request' => ['ac-assets-hm'], 'title' => 'Asset Cross-Correlation | Center for Macroeconomic Forecasting & Insights', 'models' => [], 'js' => ['init', 'ac-assets-hm']],
			['template' => 'ac-regions', 'request' => ['ac-regions'], 'title' => 'Regional Cross-Correlation Index | Center for Macroeconomic Forecasting & Insights', 'models' => [], 'js' => ['init', 'ac-regions']],
			['template' => 'ac-regions-hm', 'request' => ['ac-regions-hm'], 'title' => 'Treasury Yield Forecasts | Center for Macroeconomic Forecasting & Insights', 'models' => [], 'js' => ['init', 'ac-regions-hm']],
			['template' => 'fc-macro-other', 'request' => ['fc-macro-inf'], 'title' => 'Macroeconomic Indicator Forecasts', 'models' => [], 'js' => ['init', 'fc-rates-other']],
		*/		
//			['template' => 'blog', 'request' => 'blog', 'title' => 'The Center for Macroeconomic Forecasts & Insights', 'models' => [], 'js' => []],
			
			['template' => 'home', 'request' => ['', 'home'], 'canonical' => 'https://econforecasting.com', 'title' => 'econforecasting.com | Macroeconomic Forecasts & Insights', 'description' => 'Get aggregated macroeconomic data, forecasts, models, and insights including GDP forecasts, interest rate forecasts, and Treasury yield forecasts.', 'models' => [], 'js' => ['init', 'home']],
			
			['template' => 'forecast-rates', 'request' => ['forecast-sofr', 'fc-rates-sofr'], 'canonical' => 'https://econforecasting.com/forecast-sofr', 'title' => 'SOFR Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the SOFR rate using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-rates', 'request' => ['forecast-ffr', 'fc-rates-ffr'], 'canonical' => 'https://econforecasting.com/forecast-ffr', 'title' => 'FFR Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the federal funds rate using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-rates', 'request' => ['forecast-bsby'], 'title' => 'BSBY Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the Bloomberg short-term rate rate using a futures market driven forecast model.', 'models' => [],  'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-rates', 'request' => ['forecast-ameribor'], 'title' => 'AMERIBOR Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the AMERIBOR rate using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-rates', 'request' => ['forecast-mort30y'], 'title' => '30-Year Mortgage Rate Forecasts | Economic Forecasts | econforecasting.com', 'description' => 'We provide monthly forecasts of the 30-year U.S. fixed-rate mortgage rate using a quantitatively driven model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-rates', 'request' => ['forecast-mort15y'], 'title' => '15-Year Mortgage Rate | Economic Forecasts | econforecasting.com', 'description' => 'We provide monthly forecasts of the 15-year U.S. fixed-rate mortgage rate using a quantitatively driven model.', 'models' => [], 'js' => ['init', 'forecast-varname']],

			['template' => 'forecast-treasury-curve', 'request' => ['forecast-treasury-curve', 'fc-rates-tcurve', 'fc-rates-t-info'], 'canonical' => 'https://econforecasting.com/forecast-treasury-curve', 'title' => 'Treasury Yield Curve Forecasts | econforecasting.com', 'description' => 'We generate monthly forecasts of the full Treasury yield curve by interpolating futures-market expectations with a three-factor curve parametrization model.', 'models' => [], 'js' => ['init', 'forecast-treasury-curve']],
			['template' => 'forecast-rates', 'request' => ['forecast-t03m'], 'title' => '3 Month Treasury Yield Forecast | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the 3-month Treasury bill yield using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-rates', 'request' => ['forecast-t06m'], 'title' => '6 Month Treasury Yield Forecast | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the 6-month Treasury bill yield using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-rates', 'request' => ['forecast-t01y'], 'title' => '1 Year Treasury Yield Forecast | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the 1-year Treasury note yield using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-rates', 'request' => ['forecast-t02y'], 'title' => '2 Year Treasury Yield Forecast | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the 2-year Treasury note yield using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-rates', 'request' => ['forecast-t05y'], 'title' => '5 Year Treasury Yield Forecast | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the 5-year Treasury note yield using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-rates', 'request' => ['forecast-t10y'], 'title' => '10 Year Treasury Yield Forecast | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the 10-year Treasury bond yield using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-rates', 'request' => ['forecast-t20y'], 'title' => '20 Year Treasury Yield Forecast | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the 20-year Treasury bond yield using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-rates', 'request' => ['forecast-t30y'], 'title' => '30 Year Treasury Yield Forecast | Economic Forecasts | econforecasting.com', 'description' => 'Our model provides monthly forecasts of the 30-year Treasury bond yield using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
			
			['template' => 'forecast-rates', 'request' => ['forecast-sonia'], 'title' => 'SONIA Rate Forecast | Economic Forecasts | econforecasting.com', 'description' => 'View up-to-date monthly forecasts of the Sterling Overnight Index Average (SONIA) using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-rates', 'request' => ['forecast-estr'], 'title' => 'Euro Short Term Rate (ESTR) Forecast | Economic Forecasts | econforecasting.com', 'description' => 'View up-to-date monthly forecasts of the Sterling Overnight Index Average (SONIA) using a futures market driven forecast model.', 'models' => [], 'js' => ['init', 'forecast-varname']],

			['template' => 'forecast-macro', 'request' => ['forecast-cpi'], 'title' => 'Inflation Forecast | Economic Forecasts | econforecasting.com', 'description' => 'By utilizing the spread between Treasury Inflation Protected Securities (TIPS) and Treasuries, we can estimate the market-expected inflation rate.', 'models' => [], 'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-macro', 'request' => ['forecast-gdp'], 'title' => 'U.S. Real GDP Forecast | Economic Forecasts | econforecasting.com', 'description' => 'We utilize a model-of-models to combine forecasts with different strengths into a single composite prediction of real Gross Domestic Product (GDP).', 'models' => [], 'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-macro', 'request' => ['forecast-pce'], 'title' => 'U.S. Real Consumption Forecast | Economic Forecasts | econforecasting.com', 'description' => 'We utilize a model-of-models to combine forecasts with different strengths into a single composite prediction of real Personal Consumption Expenditures (PCE).', 'models' => [], 'js' => ['init', 'forecast-varname']],
			['template' => 'forecast-macro', 'request' => ['forecast-pdi'], 'title' => 'U.S. Real Gross Domestic Investment | Economic Forecasts | econforecasting.com', 'description' => 'We utilize a model-of-models to combine forecasts with different strengths into a single composite prediction of real Gross Private Domestic Investment.', 'models' => [], 'js' => ['init', 'forecast-varname']],

			['template' => 'nowcast-gdp', 'request' => ['nowcast-gdp'], 'title' => 'GDP Nowcasts | econforecasting.com', 'description' => 'Our nowcast model is built to provide highly up-to-date forecasts of Gross Domestic Product using the most current data available.', 'models' => [], 'js' => ['init', 'nowcast-gdp']],


			['template' => 'indices-sentiment', 'request' => ['sentiment'], 'title' => 'Sentiment Indices | econforecasting.com', 'description' => 'Our sentiment analysis indices measures the mood of the market, as based off Reddit social media trends as well as traditional media outlets.', 'models' => [], 'js' => ['init', 'indices-sentiment']],

		],
		errorRoute: ['template' => 'error', 'request' => 'error', 'title' => 'Error', 'js' => []],
		baseJsFiles: ['functions', 'moment.min', 'moment-timezone-with-data-1970-2030.min', 'gradient-min'],
		devMode: true, //($_SERVER['REMOTE_ADDR'] === '') ? true : false,
		db: 'cmefi'
	);
}
//echo $_SERVER['REMOTE_ADDR'];
