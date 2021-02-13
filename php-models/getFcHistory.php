<?php
$varsToBind =
	array(
		'varname' => (string) $fromAjax['varname'] ?? '',
		'freq' => (string) $fromAjax['freq'] ?? ''
	);


$fcHistory = $sql -> select("
SELECT obs_date, value FROM
fc_history
WHERE (
	varname = :varname
	AND
	freq = :freq
	)
ORDER BY obs_date ASC
", $varsToBind);