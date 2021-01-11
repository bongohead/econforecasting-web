<?php
session_start();
if (!isset($_SESSION['id'])) {
	$errMsg = 'Session error';
	exit();
}

$varsToBind =
	array(
		'users_id' => (int) $_SESSION['id'] ?? 9999999999,
		'id' => (int) $fromAjax['id'] ?? 9999999999,
		'name' => (string) $fromAjax['name'] ?? null,
		'rel_order' => (int) $fromAjax['rel_order'] ?? null,
		'parent_id' => (int) $fromAjax['parent_id'] ?? null,
		'debit_effect' => (int) $fromAjax['debit_effect'] ?? null,
		'is_open' => (int) $fromAjax['is_open'] ?? null
	);

$sql -> getQueryResult("
	UPDATE accounts AS a SET
		name = a2.name,
		rel_order = CAST(a2.rel_order AS INT),
		parent_id = CAST(a2.parent_id AS INT),
		debit_effect = CAST(a2.debit_effect AS INT),
		is_open = CAST(a2.is_open AS BOOLEAN)
	FROM (VALUES
		(:id, :name, :rel_order, :parent_id, :debit_effect, :is_open)
	) AS a2(id, name, rel_order, parent_id, debit_effect, is_open)
	WHERE (
		CAST(a2.id AS INT) = a.id
		AND
		a.users_id = :users_id
		);
", $varsToBind);

$updatedAccounts = $sql -> successRowsChanged;