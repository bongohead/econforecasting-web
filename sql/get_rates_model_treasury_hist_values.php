<?php
$vars_to_bind =
	array(
	);

$treasury_hist_values = $sql -> select("
SELECT varname, date, value, SUBSTRING(varname, 2, 2)::INT * (CASE WHEN SUBSTRING(varname, 4, 2) = 'm' THEN 1 ELSE 12 END)::INT AS ttm
FROM rates_model_hist_values
WHERE (
	varname ~ 't\d{2}[m|y]'
	AND freq = 'm'
	)
ORDER BY date ASC
", $vars_to_bind);