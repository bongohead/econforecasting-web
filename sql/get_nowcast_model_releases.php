<?php

$releases = $sql -> select("
SELECT relkey, relname, n_dfm_varnames, dfm_varnames, varnames, relurl, reldates FROM
nowcast_model_releases
WHERE relkey NOT IN ('COIN.CRYPT', 'MOO.BOND')
");
