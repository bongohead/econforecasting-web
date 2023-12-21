<?php
// Returns the last forecast from each forecast model for the given variable.
// Takes as input a string/array of varnames, a string/array of freqs, a string/array/null of forecasts, and a string/array/null of forms
// Allows selection of:
//  - 1+ varname (passing none returns nothing)
//  - 1+ frequency (passing none returns nothing)
//  - 0+ forecasts (passing none returns all forecasts)
//  - 0+ forms (passing none returns all forms)
// Inputs for all elements are strings such that they can be casted to VARCHAR in postgresq
//   i.e. varname = ANY('{gdp, pce}'::VARCHAR[])
$vars_to_bind = array(
	'varname' => '{'.implode(',', (array) $fromAjax['varname'] ?? '').'}',  // If null, set as '{}'
	'freq' => '{'.implode(',', (array) $fromAjax['freq'] ?? '').'}', // If null, set as '{}'
	'forecast' => isset($fromAjax['forecast']) ? '{'.implode(',', (array) $fromAjax['forecast']).'}' : '', // If null, set as ''
	'form' => isset($fromAjax['form']) ? '{'.implode(',', (array) $fromAjax['form']).'}' : '', // If null, set as ''
	);

$forecast_str = $vars_to_bind['forecast'] != '' ? 'AND forecast = ANY(:forecast::VARCHAR[])' : '';
$form_str = $vars_to_bind['form'] != '' ? 'AND form = ANY(:form::VARCHAR[])' : '';

$col_str = implode(',', array_merge(
	isset($fromAjax['varname']) && count((array) $fromAjax['varname']) === 1 ? [] : ['varname'],
	isset($fromAjax['freq']) && count((array) $fromAjax['freq']) === 1 ? [] : ['freq'],
	isset($fromAjax['forecast']) && count((array) $fromAjax['forecast']) === 1 ? [] : ['forecast, f.external, f.shortname, f.description'],
	isset($fromAjax['form']) && count((array) $fromAjax['form']) === 1 ? [] : ['form'],
	['vdate', 'date', 'value']
	));

// Note: does not partition over date, so this query returns only the latest vintage for the variable/freq/forecast combo regardless of date
$forecast_values = $sql -> select("
SELECT ${col_str}
FROM 
(
	SELECT forecast, freq, form, varname, vdate, date, value, MAX(vdate) OVER (partition by forecast, freq, form, varname) AS max_vdate
	FROM
	(
		SELECT 
			forecast, freq, form, date, varname, MAX(vdate) as vdate, last(value, vdate) as VALUE
		FROM forecast_values
		WHERE 
			varname = ANY(:varname::VARCHAR[])
			AND freq = ANY(:freq::VARCHAR[])
			${forecast_str}
			${form_str}
		GROUP BY forecast, varname, form, freq, date
		ORDER BY forecast, varname, form, freq, date
	) a 
) b
LEFT JOIN forecasts f ON b.forecast = f.id
WHERE max_vdate = vdate
ORDER BY vdate, date
", $vars_to_bind);