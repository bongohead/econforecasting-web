<?php
session_start();
session_reset();
/* php -r 'echo password_hash("test", PASSWORD_DEFAULT)."\n";'*/
$varsToBind =
	array(
		'email' => $fromAjax['email'] ?? 9999999999
	);

$checkLogin = $sql -> selectToArray("
	SELECT * FROM users WHERE email = :email
", $varsToBind);

if (count($checkLogin) === 1) {
	$correctLogin = password_verify($fromAjax['password'], $checkLogin[0]['password']);
} else {
	$correctLogin = FALSE;
}

if ($correctLogin === TRUE) {
	$_SESSION['email'] = $checkLogin[0]['email'];
	$_SESSION['id'] = $checkLogin[0]['id'];
	$login = ['verified' => true];
} else {
	$login = ['verified' => false];
}