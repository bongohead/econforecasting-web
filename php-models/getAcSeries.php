<?php
$varsToBind =
	array(
		'seriesIds' => (string) $fromAjax['fundSeriesMapIds'] ?? '',
		'startDate' => date($fromAjax['startDate']) ?? date('Y-m-d'),
		'endDate' => date($fromAjax['endDate']) ?? date('Y-m-d')
	);


// https://stackoverflow.com/questions/10738446/postgresql-select-rows-where-column-array
$acSeries = $sql -> select("
SELECT ac_series.*, ac_fund_series_map.fk_fund1, ac_fund_series_map.fk_fund2
FROM ac_series
RIGHT JOIN ac_fund_series_map
ON ac_series.fk_id = ac_fund_series_map.id
WHERE (
	date >= :startDate
	AND date <= :endDate
	AND fk_id = ANY (:seriesIds::INT[])
	)
", $varsToBind);