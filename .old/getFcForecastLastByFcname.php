<?php
$varsToBind =
	array(
		'fcname' => (string) $fromAjax['fcname'] ?? ''
	);


$fcForecast = $sql -> select("
SELECT vintage_date, obs_date, varname, value FROM
fc_forecast
WHERE (
	fcname = :fcname
	AND
	vintage_date = (SELECT MAX(vintage_date) FROM fc_forecast WHERE fcname = :fcname)
	)
", $varsToBind);