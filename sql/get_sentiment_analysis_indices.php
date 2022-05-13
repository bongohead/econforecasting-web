<?php

$indices = $sql -> select("
	SELECT id, name
	FROM sentiment_analysis_indices
	WHERE id IN (1, 2, 4)
");

$index_values = $sql -> select("
	SELECT
		index_id, date, count, ROUND(score_adj, 1) AS score, ROUND(score_adj_7dma, 1) AS score_7dma, DATE(created_at) AS created_at
	FROM sentiment_analysis_index_values
	--INNER JOIN sentiment_analysis_indices ON sentiment_analysis_index_values.index_id = sentiment_analysis_indices.id
	WHERE index_id IN (1, 2, 4)
	ORDER BY index_id, date
");

$index_stats = $sql -> select("
	SELECT 
		index_id, last_updated, ROUND(last_val, 1) AS last_val, ROUND(ch1w, 1) AS ch1w, ROUND(ch1m, 1) AS ch1m
	FROM 
		(
		SELECT
			index_id,
			date AS last_updated,
			ROW_NUMBER() OVER (PARTITION BY index_id ORDER BY DATE DESC) AS rrank, 
			score_adj_7dma as last_val,
			score_adj_7dma - lag(score_adj_7dma, 7) OVER (PARTITION BY index_id ORDER BY DATE) AS ch1w,
			score_adj_7dma - lag(score_adj_7dma, 30) OVER (PARTITION BY index_id ORDER BY DATE) AS ch1m
		FROM sentiment_analysis_index_values
		-- INNER JOIN sentiment_analysis_indices ON sentiment_analysis_index_values.index_id = sentiment_analysis_indices.id
		WHERE index_id IN (1, 2, 4)
		) a
	WHERE rrank = 1
");

