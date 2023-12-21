<?php

$benchmarks = $sql -> select("
	SELECT varname, fullname
	FROM sentiment_analysis_benchmarks
	WHERE varname IN ('sp500', 'sp500tr30', 'kcflfi', 'vix')
");

$benchmark_values = $sql -> select("
	SELECT varname, date, value, DATE(created_at) AS created_at
	FROM sentiment_analysis_benchmark_values
	WHERE varname IN ('sp500', 'sp500tr30', 'kcflfi', 'vix')
	ORDER BY varname, date

");



