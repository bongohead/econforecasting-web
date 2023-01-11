<?php

$varsToBind =
	array(
		//'form' => (string) $fromAjax['dispgroup'] ?? '',
		'tskey' => isset($fromAjax['tskey']) ? (string) $fromAjax['tskey'] : NULL,
		'freq' => isset($fromAjax['freq']) ? (string) $fromAjax['freq'] : NULL,
		'form' => isset($fromAjax['form']) ? (string) $fromAjax['form'] : NULL,
		'varname' => isset($fromAjax['varname']) ? (string) $fromAjax['varname'] : NULL,
	);
	
$tskeyStr = $varsToBind['tskey'] != NULL ? "AND tskey = ANY (:tskey::TEXT[])": '';  // https://stackoverflow.com/questions/10738446/postgresql-select-rows-where-column-array
$freqStr = $varsToBind['freq'] != NULL ? "AND freq = ANY (:freq::TEXT[])": '';  // https://stackoverflow.com/questions/10738446/postgresql-select-rows-where-column-array
$formStr = $varsToBind['form'] != NULL ? "AND form = ANY (:form::TEXT[])": '';  // https://stackoverflow.com/questions/10738446/postgresql-select-rows-where-column-array
$varnameStr = $varsToBind['varname'] != NULL ? "AND varname = ANY (:varname::TEXT[])": '';  // https://stackoverflow.com/questions/10738446/postgresql-select-rows-where-column-array

$tsValues = $sql -> select("
SELECT
	DISTINCT ON (tskey, freq, form, varname, date, vdate)
	tskey, freq, form, varname, date, vdate, value
FROM csm_tsvalues
WHERE (
	1=1
	${tskeyStr}
	${freqStr}
	${varnameStr}
	${formStr}
	)
ORDER BY vdate DESC
", $varsToBind);
