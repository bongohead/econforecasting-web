<?php
session_start();
if (!isset($_SESSION['id'])) {
	$errMsg = 'Session error';
	exit();
}

$varsToBind =
	array(
		'users_id' => (int) $_SESSION['id'] ?? 9999999999,
		'name' => (string) $fromAjax['name'] ?? null,
		'parent_id' => (int) $fromAjax['parent_id'] ?? null,
		'debit_effect' => (int) $fromAjax['debit_effect'] ?? null,
		'is_open' => (bool) TRUE,
		'rel_order' => (int) $fromAjax['rel_order'] ?? null,
		'date_created' => (string) date('Y-m-d')
	);

// Remember to set correct database in dbeaver	
//	SELECT setval('users_id_seq', (SELECT MAX(id) + 1 from users));

$sql -> getQueryResult("
	INSERT INTO accounts
		(users_id, name, parent_id, debit_effect, is_open, rel_order, date_created)
	VALUES
		(:users_id, :name, :parent_id, :debit_effect, :is_open, :rel_order, :date_created);
", $varsToBind);

$addedAccounts = $sql -> successRowsChanged;