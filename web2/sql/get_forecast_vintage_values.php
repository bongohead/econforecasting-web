<?php
// Returns first forecast for each month
// Takes as input a variable, frequency, form, and 1+ forecasts.
$vars_to_bind = array(
	'varname' => isset($fromAjax['varname']) ? $fromAjax['varname'] : '',  // If null, set as ''
	'freq' => isset($fromAjax['freq']) ? $fromAjax['freq'] : '', // If null, set as ''
	'forecast' => isset($fromAjax['forecast'])? $fromAjax['forecast'] : '', // If null, set as ''
	'form' => isset($fromAjax['form']) ? $fromAjax['form'] : '', // If null, set as ''
	);

// Get first vdates of each month that have at least 5 data counts
$forecast_vintage_values = $sql -> select(
"
SELECT date, vdate, value FROM (
	SELECT date, vdate, value, agg_vdate, MIN(vdate) OVER (PARTITION BY agg_vdate) AS min_vdate_per_month FROM (
		SELECT 
			date, vdate, value, DATE(date_trunc('month', vdate)) AS agg_vdate, COUNT(*) OVER (PARTITION BY vdate) AS vdate_count
		FROM forecast_values
		WHERE 
			varname = :varname
			AND freq = :freq
			AND forecast = :forecast
			AND form = :form
			AND vdate < date
			AND vdate >= NOW() - INTERVAL '1 YEARS'
			AND date < vdate + INTERVAL '3 YEARS'
		ORDER BY date, vdate
		) a
	WHERE vdate_count >= 5
	) b 
WHERE min_vdate_per_month = vdate
ORDER BY vdate, date
", $vars_to_bind);

/*
"
SELECT date, vdate, value
FROM (
	SELECT *, ROW_NUMBER() OVER (PARTITION BY date, agg_vdate ORDER BY agg_vdate) AS rn, COUNT(*) OVER (PARTITION BY date, agg_vdate) AS group_count
	FROM (
		SELECT 
			date, vdate, value, DATE(date_trunc('month', vdate)) AS agg_vdate
		FROM forecast_values
		WHERE 
			varname = :varname
			AND freq = :freq
			AND forecast = :forecast
			AND form = :form
			AND vdate < date
			AND date >= NOW() - INTERVAL '5 YEARS'
		ORDER BY date, vdate
	) a
) b
WHERE rn = 1
AND group_count >= 3 -- Only return forecast x date groups
*/