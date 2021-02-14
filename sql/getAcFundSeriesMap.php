<?php
$varsToBind =
	array(
		'usage' => (string) $fromAjax['usage'] ?? null,
		'method' => (string) $fromAjax['method'] ?? null,
		'roll' => (string) $fromAjax['roll'] ?? null,
	);


$acFundSeriesMap = $sql -> select("
SELECT * FROM ac_fund_series_map
WHERE usage = :usage AND method = :method AND roll = :roll
", $varsToBind);
/*
$acFundSeriesMap = $sql -> select("
SELECT ac_fund_series_map.*, t1.ticker AS ticker1, t2.ticker AS ticker2
FROM ac_fund_series_map
RIGHT JOIN ac_fund AS t1
ON ac_fund_series_map.fk_fund1 = t1.id
RIGHT JOIN ac_fund AS t2
ON ac_fund_series_map.fk_fund2 = t2.id
", $varsToBind);
*/