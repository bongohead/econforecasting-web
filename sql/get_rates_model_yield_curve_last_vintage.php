<?php
$vars_to_bind = array();

$submodel_values = $sql -> select("
SELECT submodel, freq, date, vdate, value
FROM 
(
	SELECT submodel, varname, freq, date, vdate, value, max(vdate) OVER (PARTITION BY submodel, freq) AS max_vdate
	FROM
	(
		SELECT 
			submodel, varname, freq, date, MAX(vdate) as vdate, last(value, vdate) as VALUE
		FROM rates_model_submodel_values
		WHERE 
			varname LIKE 't___'
		GROUP BY submodel, varname, freq, date
		ORDER BY submodel, varname, freq, date
	) a 
) b
WHERE max_vdate = vdate
", $vars_to_bind);