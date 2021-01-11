<?php
session_start();
if (!isset($_SESSION['id'])) {
	$errMsg = 'Session error';
	exit();
}

$varsToBind =
	array(
		'users_id' => (int) $_SESSION['id'] ?? 9999999999,
		'id' => (int) $fromAjax['id'],
		'date' => (string) $fromAjax['date'] ?? null,
		'description' => (string) $fromAjax['description'] ?? null,
		'value' => (double) $fromAjax['value'] ?? null,
		'debit' => (int) $fromAjax['debit'] ?? null,
		'credit' => (int) $fromAjax['credit'] ?? null
	);

$sql -> getQueryResult("
	UPDATE transactions AS a SET
		date = CAST(a2.date AS date),
		description = CAST(a2.description AS TEXT),
		value = CAST(a2.value AS NUMERIC),
		debit = CAST(a2.debit AS INT),
		credit = CAST(a2.credit AS INT)
	FROM (VALUES
		(:id, :date, :description, :value, :debit, :credit)
	) AS a2(id, date, description, value, debit, credit)
	WHERE (
		CAST(a2.id AS INT) = a.id
		AND
		a.users_id = :users_id
		);
", $varsToBind);

$updatedTransactions = $sql -> successRowsChanged;