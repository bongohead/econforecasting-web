<?php
// Returns the last forecast from each forecast model for the given variable
$vars_to_bind =
	array(
		'varname' => (string) $fromAjax['varname'] ?? '',
		'freq' => (string) $fromAjax['freq'] ?? NULL
	);

$freqStr = $vars_to_bind['freq'] != NULL ? "AND freq = :freq": '';

$submodel_values = $sql -> select("
SELECT 
	submodel, freq, date, MAX(vdate) as vdate, last(value, vdate) as VALUE
FROM rates_model_submodel_values
WHERE 
	varname = :varname
	${freqStr}
GROUP BY submodel, freq, date
ORDER BY submodel, freq, date
", $vars_to_bind);

