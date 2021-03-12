<?php
// Returns the last forecast from each forecast model for the given variable
// Additionally only returns vintages for forecast dates for which no historical data exists (left anti join)
$varsToBind =
	array(
		'dispgroup' => (string) $fromAjax['dispgroup'] ?? '',
		'freq' => (string) $fromAjax['freq'] ?? NULL
	);

$ncValues = $sql -> select("
SELECT a.varname, a.vdate, a.date, a.value, a.form, b.fullname, b.units, b.d1, b.d2 FROM nc_values a
LEFT JOIN nc_params b
ON a.varname = b.varname
LEFT JOIN nc_history c
ON (a.date = c.date AND a.varname = c.varname AND a.form = c.form)
WHERE (
b.dispgroup = :dispgroup
AND
a.freq = :freq
AND 
a.form IN ('d1', 'd2')
AND
c.date IS NULL
)
", $varsToBind);

// a.vdate = (SELECT MAX(vdate) FROM nc_values)
