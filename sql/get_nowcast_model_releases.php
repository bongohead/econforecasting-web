<?php
/* Returns releases for all INPUT DFM data as well as GDP output data */
$releases = $sql -> select("
	(
	SELECT r.id, r.fullname, r.url, d.release_dates, v.input_varnames
	FROM nowcast_model_input_releases r
	INNER JOIN 
		(
			SELECT release, json_agg(date) AS release_dates
			FROM nowcast_model_input_release_dates
			WHERE date >= CURRENT_DATE + interval '-2 years'
			GROUP BY release
		) d on r.id = d.release
	INNER JOIN 
		(
			SELECT release, json_agg(varname) AS input_varnames
			FROM nowcast_model_variables
			WHERE nc_dfm_input = TRUE
			GROUP BY release
		) v on r.id = v.release
	WHERE r.id NOT IN ('MOO.BOND', 'NYF.FFR')
	)
UNION ALL
	(
	SELECT r.id, r.fullname, r.url, d.release_dates, v.input_varnames
	FROM forecast_hist_releases r 
	INNER JOIN 
		(SELECT release, json_agg(date) AS release_dates FROM forecast_hist_release_dates WHERE date >= CURRENT_DATE + interval '-2 years' GROUP BY release) d
		ON r.id = d.release
	INNER JOIN 
		(SELECT release, json_agg(varname) AS input_varnames FROM forecast_variables GROUP BY release) v 
		ON	r.id = v.release
	WHERE r.id = 'BEA.GDP'
	)
");
