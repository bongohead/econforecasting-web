<?php
$varsToBind =
	array(
		'usage' => (string) $fromAjax['usage'] ?? null,
	);


$acSeriesDates = $sql -> select("
SELECT date FROM ac_series
WHERE fk_id = (
	SELECT id FROM ac_fund_series_map WHERE usage = :usage ORDER BY obs_start DESC LIMIT 1
)
", $varsToBind);
