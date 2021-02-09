<?php
// Returns the last forecast from each forecast model for the given variable
$varsToBind =
	array(
		'varname' => (string) $fromAjax['varname'] ?? '',
		'freq' => (string) $fromAjax['freq'] ?? ''
	);


$freqStr = $varsToBind['freq'] !== '' ? "AND c.freq = :freq": ''

$fcHistory = $sql -> select("
SELECT a.*, c.freq, c.fullname, c.cmefi FROM fc_forecast a
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
WHERE a.varname = :varname
${freqStr}
", $varsToBind);
