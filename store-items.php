<?php

/*
 * Query the database and return an array of associative arrays representing the rows.
 * $type should be either "entrees" or "sides".
 */
function get_entry_list($type) {
	$cart = [];

	if (isset($_COOKIE["mca-restaurant-cart"])) {
		$cart = json_decode($_COOKIE["mca-restaurant-cart"], true);
	}

	if ($type != "entrees" && $type != "sides") {
		print("<script>console.log('invalid type ${type} in get_entry_list');</script>");
		return;
	}

	$db = new SQLite3('db.sqlite3');
	$arr = [];
	$query = $db->query("select * from ${type}");

	for ($i = 0; $i < $query->numColumns(); $i++) {
		$arr[$i] = $query->fetchArray(SQLITE3_ASSOC);

		/* Search the cart in the cookie for an id & type match for keeping track of quantity */
		$cart_searched = array_reduce($cart, function($c, $e) use ($arr, $i, $type) {
			if (((int)$e['id'] === $arr[$i]['id']) && $e['type'] . "s" === $type) {
				assert($c === null); // duplicate check
				$c = $e;
			}
			return $c;
		});

		if ($cart_searched !== null) {
			$arr[$i]['qty'] = $cart_searched['qty'];
		} else {
			$arr[$i]['qty'] = 0;
		}
	}

	$db->close();
	return $arr;
}

/*
 * Use globals here to avoid having to generate the list multiple times.
 * Ideally the arrays would be immutable and should be treated as read only.
 */
$entrees = get_entry_list("entrees");
$sides = get_entry_list("sides");

function build_cards($list, $type) {
	foreach($list as $e) {
		print("<div class=\"content-box menu-card\" data-id=\"{$e['id']}\" data-type=\"{$type}\" data-img=\"{$e['img']}\" data-price=\"{$e['price']}\" data-qty=\"{$e['qty']}\">");
		print("<img class=\"img-fluid\" src=\"{$e['img']}\" alt=\"{$e['name']}\">");
		print("<button class=\"remove-button btn btn-dark d-none\" data-id=\"{$e['id']}\"data-type=\"{$type}\">−</button>");
		print('<div class="content-box-text">');
		print("<h3>{$e['name']}</h3>");
		print("<p>{$e['desc']}</p>");
		print("<p class=\"card-price\"><span class=\"item-qty\">{$e['qty']}</span> — \${$e['price']}</p>");
		print('</div>');
		print('</div>');
	}
}

function build_entree_list() {
	global $entrees;
	if (count($entrees) === 0) return;
	print('<h2>Entrée</h2>');
	print('<div id="entreeMenu" class="menu-container">');
	build_cards($entrees, "entree");
	print('</div>');
}

function build_side_list() {
	global $sides;
	if (count($sides) === 0) return;
	print('<h2>Sides</h2>');
	print('<div id="sideMenu" class="menu-container">');
	build_cards($sides, "side");
	print('</div>');
}
