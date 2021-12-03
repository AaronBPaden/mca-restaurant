<?php
class StoreEntry {
	public function __constructor($id, $name, $desc, $price, $img) {
		$this->id = $id;
		$this->name = $name;
		$this->desc = $desc;
		$this->price = $price;
		$this->img = $img;
	}
}

/*
 * return a list of StoreEntry objects from the database.
 * Type should be either "entrees" or "sides"
 */
function get_entry_list($type) {
	$db = new SQLite3('db.sqlite3');
	if ($type != "entrees" && $type != "sides") {
		print("<script>console.log('invalid type ${type} in get_entry_list');</script>");
		return;
	}
	var_dump($db->query("select * from ${type}"));
}

get_entry_list("sides");
