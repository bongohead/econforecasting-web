<?php

$roberta_values = $sql -> select("
	SELECT category, date, emotion, value
	FROM sentiment_analysis_roberta_category_values
");