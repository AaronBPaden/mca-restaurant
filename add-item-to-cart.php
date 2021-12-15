<?php
function send_response($arr) {
	header("Content-Type: application/json");
	print(json_encode($arr));
	exit();
}

function send_error($msg, $cart = null) {
	send_response([
		"cart" => $cart,
		"success" => false,
		"msg" => $msg,
		"POST" => json_encode($_POST),
	]);
}

function send_cookie($cart) {
	$success = setcookie("mca-restaurant-cart", json_encode($cart), [
		"samesite" => "Strict",
		"expires" => time()+(60*5), // Five minutes
	]);
	if (!$success) {
		send_response([
			"cart" => null,
			"success" => false,
			"msg" => "cannot set cookie.",
		]);
	}
	send_response([
		"cart" => $cart,
		"success" => true,
		"msg" => ""
	]);
}

/*
 * Push a new item to the cart.
 */
function add_new_item($cart) {
	$cart[] = [
		"id" => $_POST["id"],
		"qty" => 1,
		"type" => $_POST["type"],
	];
	return $cart;
}

/* 
 * Search the cart to see if the item in POST is already included
 * If so, increment the quantity. Otherwise, add a new item.
 */
function process_cart($cart) {
	$i = null;
	$qty = null;
	foreach($cart as $j => $e) {
		if (((int)$e['id'] === (int)$_POST['id']) && ($e['type'] === $_POST['type'])) {
			if ($i !== null) send_error("Error: duplicate item detected");
			assert($i === null);
			$i = $j;
			$qty = (int)$e['qty'];
		}
	}
	if ($i === null) {
		$cart = add_new_item($cart);
	} else {
		$cart[$i] = [
			"id" => $_POST["id"],
			"qty" => $qty + 1,
			"type" => $_POST["type"],
		];
	}
	return $cart;
}

function main() {
	if (!isset($_POST["id"]) || !isset($_POST["qty"]) || !isset($_POST["type"])) {
		send_error("No valid POST data sent to add-item-to-cart.");
	}
	$cart = [];
	if (isset($_COOKIE["mca-restaurant-cart"])) {
		$cart = json_decode($_COOKIE["mca-restaurant-cart"], true);
		$cart = process_cart($cart);
	} else {
		$cart = add_new_item($cart);
	}
	send_cookie($cart);
}
main();
?>
