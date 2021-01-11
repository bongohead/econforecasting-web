<?php
session_start();
if (!isset($_SESSION['id'])) {
	$errMsg = 'Session error';
	exit();
}

$varsToBind =
	array(
		'users_id' => (int) $_SESSION['id'] ?? 9999999999,
		'date' => (string) $fromAjax['date'] ?? null,
		'description' => (string) $fromAjax['description'] ?? null,
		'value' => (double) $fromAjax['value'] ?? null,
		'debit' => (int) $fromAjax['debit'] ?? null,
		'credit' => (int) $fromAjax['credit'] ?? null
	);
	

//	SELECT setval('transactions_id_seq', (SELECT MAX(id) + 1 from transactions));
$sql -> getQueryResult("
	INSERT INTO transactions
		(users_id, date, description, value, debit, credit)
	VALUES
		(:users_id, :date, :description, :value, :debit, :credit);
", $varsToBind);

$addedTransactions = $sql -> successRowsChanged;