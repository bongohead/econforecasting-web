<?php
$varsToBind =
	array(
		'usage' => (string) $fromAjax['usage'] ?? null,
	);


$acIndex = $sql -> select("
SELECT * FROM ac_index WHERE usage = :usage ORDER BY date ASC;
", $varsToBind);