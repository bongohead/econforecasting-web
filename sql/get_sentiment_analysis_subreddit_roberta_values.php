<?php

// Returns JSON data in tree format to save space
// https://stackoverflow.com/questions/42222968/create-nested-json-from-sql-query-postgres-9-4
$subreddit_roberta_values = $sql -> select("
SELECT
	subreddit,
	json_agg(
		json_build_object(
			'emotion', emotion,
			'data', s
		)
	) AS series
FROM 
(
	SELECT 
	    subreddit,
	    emotion,
		json_agg(
			json_build_array(
				EXTRACT(epoch FROM t.date) * 1000,
				t.value
			)
		) AS s
	FROM sentiment_analysis_subreddit_roberta_values t
	WHERE emotion <> 'neutral'
	GROUP BY subreddit, emotion
) a
GROUP BY subreddit
");
