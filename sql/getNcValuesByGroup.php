<?php
// Returns the last forecast from each forecast model for the given variable
$varsToBind =
	array(
		'dispgroup' => (string) $fromAjax['dispgroup'] ?? '',
		'freq' => (string) $fromAjax['freq'] ?? NULL
	);

$fcForecast = $sql -> select("
SELECT a.varname, a.vdate, a.date, b.fullname, b.units, b.d1, b.d2 FROM nc_values a
LEFT JOIN nc_params b
ON a.varname = b.varname
WHERE (
a.vdate = (SELECT MAX(vdate) FROM nc_values)
AND
b.dispgroup = :dispgroup
AND
a.freq = :freq
)
", $varsToBind);
