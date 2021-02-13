<?php
// Returns the last forecast from each forecast model for the given variable
$varsToBind =
	array(
		'varname' => (string) $fromAjax['varname'] ?? '',
		'freq' => (string) $fromAjax['freq'] ?? NULL
	);

$freqStr = $varsToBind['freq'] != NULL ? "AND c.freq = :freq": '';

$fcForecast = $sql -> select("
SELECT a.vintage_date, a.value, a.obs_date, a.fcname, c.freq, c.fullname, c.shortname, c.cmefi FROM fc_forecast a
INNER JOIN (
	SELECT DISTINCT ON (fcname) fcname, vintage_date, varname
	FROM fc_forecast WHERE varname = :varname
	ORDER BY fcname, vintage_date DESC
	) b
ON 
	a.vintage_date = b.vintage_date
	AND a.fcname = b.fcname
	AND a.varname = b.varname
INNER JOIN fc_forecastnames c
ON a.fcname = c.fcname
ORDER BY obs_date asc
${freqStr}
", $varsToBind);

