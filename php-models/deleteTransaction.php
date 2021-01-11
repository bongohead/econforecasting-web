<?php
session_start();
if (!isset($_SESSION['id'])) {
	$errMsg = 'Session error';
	exit();
}

$varsToBind =
	array(
		'users_id' => (int) $_SESSION['id'] ?? 9999999999,
		'id' => (int) $fromAjax['id']
	);

$sql -> getQueryResult("
	DELETE FROM transactions
	WHERE (
		id = :id
		AND
		users_id = :users_id
		);
", $varsToBind);

$deletedTransactions = $sql -> successRowsChanged;