<?php
/* Get the 3 latest forecasted dates less than a year ahead of the current date
 *
 *
 */
$vars_to_bind = array();

$gdp_values = $sql -> select("
SELECT
	v.bdate, v.varname, v.date, v.value, p.fullname,
	CONCAT(EXTRACT(year FROM v.date), 'Q', (EXTRACT(month FROM v.date)::INT + 2)/3) AS pretty_date
FROM nowcast_model_values v
LEFT JOIN nowcast_model_variables p
	ON p.varname = v.varname
WHERE
	v.form = 'd1'
	AND p.dispgroup = 'GDP' 
	AND bdate >= CURRENT_DATE + interval '-6 months'
	AND date <= CURRENT_DATE + interval '+9 months'
", $vars_to_bind);