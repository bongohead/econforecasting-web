<?php
$varsToBind =
	array(
	);


$acSeriesDates = $sql -> select("
SELECT date FROM ac_series WHERE fk_id = 1 ORDER BY DATE ASC", $varsToBind);
