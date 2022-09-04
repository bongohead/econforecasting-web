<?php
$varsToBind =
	array(
		'usage' => (string) $fromAjax['usage'] ?? null,
	);


$acFund = $sql -> select("
SELECT * FROM ac_fund WHERE usage = :usage;
", $varsToBind);