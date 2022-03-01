<?php
$vars_to_bind = array(
	'varname' => (string) $fromAjax['varname'] ?? ''
	);


$forecast_variable = $sql -> select("
SELECT varname, fullname, units, d1, hist_source_freq
FROM forecast_variables
WHERE varname = :varname
LIMIT 1 
", $vars_to_bind);