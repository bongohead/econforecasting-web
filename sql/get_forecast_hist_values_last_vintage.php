<?php
// Returns the last historical data by the last vintage date for the given variable.
// Takes as input a string/array of varnames, a string/array of freqs, and a string/array/null of forms
// Allows selection of:
//  - 1+ varname (passing none returns nothing)
//  - 1+ frequency (passing none returns nothing)
//  - 0+ forms (passing none returns all forms)
// Inputs for all elements are strings such that they can be casted to VARCHAR in postgresq
//   i.e. varname = ANY('{gdp, pce}'::VARCHAR[])
$vars_to_bind = array(
	'varname' => '{'.implode(',', (array) $fromAjax['varname'] ?? '').'}',  // If null, set as '{}'
	'freq' => '{'.implode(',', (array) $fromAjax['freq'] ?? '').'}', // If null, set as '{}'
	'form' => isset($fromAjax['form']) ? '{'.implode(',', (array) $fromAjax['form']).'}' : '', // If null, set as ''
	);

$form_str = $vars_to_bind['form'] != '' ? 'AND form = ANY(:form::VARCHAR[])' : '';

$col_str = implode(',', array_merge(
	isset($fromAjax['varname']) && count((array) $fromAjax['varname']) === 1 ? [] : ['varname'],
	isset($fromAjax['freq']) && count((array) $fromAjax['freq']) === 1 ? [] : ['freq'],
	isset($fromAjax['form']) && count((array) $fromAjax['form']) === 1 ? [] : ['form'],
	['vdate', 'date', 'value']
	));


$forecast_hist_values = $sql -> select("
SELECT ${col_str}
FROM
(
	SELECT 
		freq, form, date, varname, MAX(vdate) as vdate, last(value, vdate) as VALUE -- Get value corresponding to latest vdate for each date
	FROM forecast_hist_values
	WHERE 
		varname = ANY(:varname::VARCHAR[])
		AND freq = ANY(:freq::VARCHAR[])
		${form_str}
	GROUP BY varname, form, freq, date
	ORDER BY varname, form, freq, date
) a
", $vars_to_bind);