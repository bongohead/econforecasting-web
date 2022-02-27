<?php
/* Get the 3 latest forecasted dates less than a year ahead of the current date
 *
 *
 */
$vars_to_bind = array();

$gdp_values = $sql -> select("
SELECT
	v.vdate, v.varname, v.date, v.value, p.fullname,
	CONCAT(EXTRACT(year FROM v.date), 'Q', (EXTRACT(month FROM v.date)::INT + 2)/3) AS pretty_date
FROM forecast_values v
LEFT JOIN forecast_variables p
	ON p.varname = v.varname
WHERE
	v.form = 'd1'
	AND p.dispgroup = 'GDP' 
	AND vdate >= CURRENT_DATE + interval '-6 months'
	AND date <= CURRENT_DATE + interval '+9 months'
	AND v.forecast = 'now'
	AND p.varname <> 'cbi'
", $vars_to_bind);