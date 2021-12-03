<?php

/*
 * Query the database and return an array of associative arrays representing the rows.
 * $type should be either "entrees" or "sides".
 */
function get_entry_list($type) {
	if ($type != "entrees" && $type != "sides") {
		print("<script>console.log('invalid type ${type} in get_entry_list');</script>");
		return;
	}
	$db = new SQLite3('db.sqlite3');
	$arr = [];
	$query = $db->query("select * from ${type}");
	for ($i = 0; $i < $query->numColumns(); $i++) {
		$arr[] = $query->fetchArray(SQLITE3_ASSOC);
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


//     populateCard(item, type) {
//         let menu = type === 'entree' ? document.getElementById('entreeMenu') : document.getElementById('sideMenu');
//         let card = document.createElement('div');
//         card.className = 'content-box menu-card';
//         card.dataset.type = type 
//         card.dataset.id = item.id;
//         card.dataset.quantity = 0;
//         card.insertAdjacentHTML('beforeend', `
//             <img class="img-fluid" src="${item.img}" alt="${item.name}">
//             <button class="remove-button btn btn-dark d-none" data-id="${item.id}" data-type="${type}">−</button>
//             <div class="content-box-text">
//                 <h3>${item.name}</h3>
//                 <p>
//                     ${item.desc}
//                 </p>
//                 <p class="card-price">
//                     <span class="item-quantity"></span> — $${item.price}
//                 </p>
//             </div>`);
//         card.addEventListener('click', this.handleClick.bind(this));
//         menu.append(card);
function build_cards($list, $type) {
	foreach($list as $e) {
		print("<div class=\"content-box menu-card\" data-id=\"{$e['id']}\" data-type=\"{$type}\" data-quantity=\"0\">");
		print("<img class=\"img-fluid\" src=\"{$e['img']}\" alt=\"{$e['name']}\">");
		print("<button class=\"remove-button btn btn-dark d-none\" data-id=\"{$e['id']}\"data-type=\"{$type}\">−</button>");
		print('<div class="content-box-text">');
		print("<h3>{$e['name']}</h3>");
		print("<p>{$e['desc']}</p>");
		print("<p class=\"card-price\"><span class=\"item-quantity\"></span> — \${$e['price']}</p>");
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
