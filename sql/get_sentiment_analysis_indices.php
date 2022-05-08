<?php

$indices = $sql -> select("
	SELECT id, name
	FROM sentiment_analysis_indices
	WHERE id IN (1, 2, 3, 4)
");

$index_values = $sql -> select("
	SELECT index_id, date, count, score, score_7dma, DATE(created_at) AS created_at
	FROM sentiment_analysis_index_values
	WHERE index_id IN (1, 2, 3, 4)
	ORDER BY index_id, date
");



