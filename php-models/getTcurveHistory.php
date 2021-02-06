<?php
$varsToBind =
	array(
	);


$fcHistory = $sql -> select("
SELECT * FROM fc_history WHERE varname LIKE 't___' AND freq = 'm'
", $varsToBind);