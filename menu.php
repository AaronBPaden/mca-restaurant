<?php
require('templates/header.html');
require('store-items.php');
print('<div id="menuPage" class="container">');
build_entree_list();
build_side_list();
print('</div>');
require('templates/footer.html');
?>
