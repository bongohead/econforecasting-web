<?php
// Returns all forecasts for a given variable.
// Takes as input a variable, frequency, forecast, and form.
$vars_to_bind = array(
	'varname' => isset($fromAjax['varname']) ? $fromAjax['varname'] : ''  // If null, set as ''
	'freq' => isset($fromAjax['freq']) ? $fromAjax['freq'] : '', // If null, set as ''
	'forecast' => isset($fromAjax['forecast']) ? $fromAjax['forecast'] : '', // If null, set as ''
	'form' => isset($fromAjax['form']) ? $fromAjax['form'] : '', // If null, set as ''
	);

$forecast_vintage_values = $sql -> select(
"
SELECT 
	date, vdate, value
FROM forecast_values
WHERE 
	varname = :varname
	AND freq = ':freq
	AND forecast = :forecast
	AND form = :form
ORDER BY date, vdate
", $vars_to_bind)