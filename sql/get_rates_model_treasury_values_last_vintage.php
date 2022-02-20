<?php
$vars_to_bind = array();

$treasury_values = $sql -> select("
SELECT date, vdate, value, SUBSTRING(varname, 2, 2)::INT * (CASE WHEN SUBSTRING(varname, 4, 2) = 'm' THEN 1 ELSE 12 END)::INT AS ttm
FROM 
(
	SELECT submodel, varname, freq, date, vdate, value, max(vdate) OVER (PARTITION BY submodel, freq) AS max_vdate
	FROM
	(
		SELECT 
			submodel, varname, freq, date, MAX(vdate) as vdate, last(value, vdate) as VALUE
		FROM rates_model_submodel_values
		WHERE 
			varname ~ 't\d{2}[m|y]' -- varname LIKE 't___'
			AND freq = 'm'
			AND submodel = 'tdns'
		GROUP BY submodel, varname, freq, date
		ORDER BY submodel, varname, freq, date
	) a 
) b
WHERE max_vdate = vdate
AND submodel = 'tdns'
", $vars_to_bind);