<?php
$vars_to_bind =
	array(
		'varname' => (string) $fromAjax['varname'] ?? '',
		'freq' => (string) $fromAjax['freq'] ?? ''
	);


$hist_values = $sql -> select("
SELECT date, value FROM
rates_model_hist_values
WHERE (
	varname = :varname
	AND
	freq = :freq
	)
ORDER BY date ASC
", $vars_to_bind);