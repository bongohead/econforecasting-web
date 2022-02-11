<?php
$vars_to_bind = array();

$gdp_values = $sql -> select("
SELECT
	v.bdate, v.varname, v.date, v.value, p.fullname
FROM nowcast_model_values v
LEFT JOIN nowcast_model_variables p
	ON p.varname = v.varname
WHERE
	v.form = 'd1'
	AND p.dispgroup = 'GDP' 
	AND (date BETWEEN CURRENT_DATE + interval '-1 years' and  current_date + interval '+1 years')
", $vars_to_bind);