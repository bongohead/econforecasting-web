<?php

$indices = $sql -> select("
	SELECT
		id,
		REPLACE(INITCAP(
			CONCAT(
				CASE
					WHEN source_type = 'reddit' THEN 'Social Media'
					ELSE 'Traditional Media'
				END,
				' ',
				content_type,
				' Sentiment Index'
			)
		), '_', ' ') AS name
	FROM sentiment_analysis_indices
	WHERE id IN (1, 2, 3, 4)
	ORDER BY source_type, id
");

$index_values = $sql -> select("
	SELECT
		index_id, date, count, ROUND(score_adj, 1) AS score, ROUND(score_adj_7dma, 1) AS score_7dma, ROUND(score_adj_14dma, 1) AS score_14dma, DATE(created_at) AS created_at
	FROM sentiment_analysis_index_values
	--INNER JOIN sentiment_analysis_indices ON sentiment_analysis_index_values.index_id = sentiment_analysis_indices.id
	WHERE index_id IN (1, 2, 3, 4)
		AND count > 0
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
			score_adj_14dma as last_val,
			score_adj_14dma - lag(score_adj_14dma, 7) OVER (PARTITION BY index_id ORDER BY DATE) AS ch1w,
			score_adj_14dma - lag(score_adj_14dma, 30) OVER (PARTITION BY index_id ORDER BY DATE) AS ch1m
		FROM sentiment_analysis_index_values
		-- INNER JOIN sentiment_analysis_indices ON sentiment_analysis_index_values.index_id = sentiment_analysis_indices.id
		WHERE index_id IN (1, 2, 3, 4)
		) a
	WHERE rrank = 1
");

$index_roberta_values = $sql -> select("
	SELECT index_id, date, emotion, value
	FROM sentiment_analysis_index_roberta_values
	WHERE index_id IN (1, 2, 3, 4) 
		AND emotion != 'neutral'
");
