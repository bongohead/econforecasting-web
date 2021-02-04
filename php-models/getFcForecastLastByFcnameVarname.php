<?php
$varsToBind =
	array(
		'fcname' => (string) $fromAjax['fcname'] ?? '',
		'varname' => (string) $fromAjax['varname'] ?? ''
	);


$fcForecast = $sql -> select("
SELECT vintage_date, obs_date, value FROM
fc_forecast
WHERE (
	fcname = :fcname
	AND
	varname = :varname
	AND
	vintage_date = (SELECT MAX(vintage_date) FROM fc_forecast WHERE varname = :varname AND fcname = :fcname)
	)
", $varsToBind);