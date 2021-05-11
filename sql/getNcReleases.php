<?php

$ncReleases = $sql -> select("
SELECT * FROM
nc_releases
WHERE id NOT IN (212, 378, 445, 427, 365, 18, 465, 22, 187, 219);
");
