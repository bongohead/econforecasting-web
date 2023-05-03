<?php

$table_values = $sql -> select("
	SELECT 
		date,
		json_agg(
			json_build_object(
				--'index_id', index_id,
				CONCAT('index-id-', index_id), score
			)
		) AS data
	FROM 
		(
		SELECT index_id, date, count, ROUND(score_adj_14dma, 1) AS score
		FROM sentiment_analysis_index_values
		WHERE index_id IN (1, 2, 3, 4) AND count > 0
		) AS t
	GROUP BY date
	ORDER BY date
");
