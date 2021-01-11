<?php
session_start();
if (!isset($_SESSION['id'])) {
	$errMsg = 'Session error';
	exit();
}
$varsToBind =
	array(
		'id1' => (int) $_SESSION['id'] ?? 9999999999,
		'id2' => (int) $_SESSION['id'] ?? 9999999999
	);
	

$accounts = $sql -> select("
WITH RECURSIVE category_path AS
(
  SELECT
		users_id, id, name, debit_effect, is_open, rel_order, date_created, date_closed,
		name::text AS name_path, id::text AS id_path, CONCAT(LPAD(rel_order::text, 10, '0'), '(', LPAD(id::text, 10, '0'), ')') AS order_path
	FROM accounts
  WHERE parent_id IS NULL AND users_id = :id1
  
	UNION ALL
  
	SELECT
		c.users_id, c.id, c.name, c.debit_effect, c.is_open, c.rel_order, c.date_created, c.date_closed,
		CONCAT(cp.name_path, ' > ', c.name::text), CONCAT(cp.id_path, ' > ', c.id::text), CONCAT(cp.order_path, ' > ', LPAD(c.rel_order::text, 10, '0'), '(', LPAD(c.id::text, 10, '0'), ')')
	FROM category_path AS cp JOIN accounts AS c
		ON cp.id = c.parent_id
		WHERE c.users_id = :id2
)
SELECT *, (CHAR_LENGTH(id_path) - CHAR_LENGTH(REPLACE(id_path, '>', ''))) / CHAR_LENGTH('>') + 1 AS nest_level
FROM category_path
ORDER BY order_path;
", $varsToBind);
	
/*
WITH RECURSIVE category_path AS
(
  SELECT users_id, id, name, debit_effect, is_open, row_order, date_created, date_closed, name::text AS path
    FROM accounts
    WHERE parent_id IS NULL AND users_id = :id1
  UNION ALL
  SELECT c.users_id, c.id, c.name, c.debit_effect, c.is_open, c.row_order, c.date_created, c.date_closed, CONCAT(cp.path, ' > ', c.name)
    FROM category_path AS cp JOIN accounts AS c
      ON cp.id = c.parent_id
     WHERE c.users_id = :id2
)
SELECT *, (CHAR_LENGTH(path) - CHAR_LENGTH(REPLACE(path, '>', ''))) / CHAR_LENGTH('>') + 1 AS nest_level
FROM category_path
ORDER BY path;
*/
/*
WITH RECURSIVE category_path AS
(
  SELECT id, name, debit_effect, is_open, row_order, date_created, date_closed, '{}'::int[] AS parents, 1 AS level
    FROM accounts
    WHERE parent_id IS NULL AND users_id = :id1
  UNION ALL
  SELECT c.id, c.name, c.debit_effect, c.is_open, c.row_order, c.date_created, c.date_closed, parents || c.parent_id, level + 1
    FROM category_path AS cp JOIN accounts AS c
    ON cp.id = c.parent_id
		WHERE c.users_id = :id2
)
SELECT *
FROM category_path
ORDER BY parents

*/