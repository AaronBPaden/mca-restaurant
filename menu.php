<?php
require('templates/header.html');
require('store-items.php');
print('<main class="main container">');
build_entree_list();
build_side_list();
/* print('<h2>Entrée (each comes with two free sides)</h2>'); */
/* print('<div id="entreeMenu" class="menu-container">'); */
/* print('</div>'); */
/* print('<h2>Sides</h2>'); */
/* print('<div id="sideMenu" class="menu-container">'); */
/* print('</div>'); */
/* print('<button id="checkoutButton" class="btn btn-primary checkout-button d-none">Checkout!</button>'); */
print('</main>');
require('templates/footer.html');
?>
