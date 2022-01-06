"use strict";

/*
 * Send an item to the cart.
 *
 * Returns the updated cart.
 */
const addItemToCart = async function(body) {
    let url = 'add-item-to-cart.php';
    let form = new FormData();
    for(const key in body) {
        form.append(key, body[key]);
    }
    const options = {
        method: 'POST',
        body: form,
    };
    try {
        let res = await fetch(url, options);
        let text = await res.text();
        return JSON.parse(text).cart;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const menuPage = () => {
    let cards = document.querySelectorAll('.menu-card');
    /*
     * Set a menu card's quantity.
     */
    const setQuantity = (el, quantity) => {
        el.dataset.qty = quantity;
        el.querySelector(".item-qty").innerText = quantity;
    }
    /*
     * Based on the provided cart, refresh the quantity for all menu items.
     */
    const refreshCards = (cart) => {
        cards.forEach((e) => {
            // Search cart to see if an ID matches the card ID.
            let i = Array.from(cart).findIndex((el) => el.id === e.dataset.id && el.type === e.dataset.type);
            if (i === -1) {
                // There was no match, so we set the quantity to zero.
                setQuantity(e, 0);
                return;
            };
            setQuantity(e, cart[i].qty);
        });
    }
    cards.forEach((el) => {
        /*
         * When clicking on a card, we send the card's data to add-item-to-cart.php.
         * An updated cart is returned and we refresh the cards to sync with the cart.
         */
        el.addEventListener("click", async function(ev) {
            let body = {
                "id": el.dataset.id,
                "qty": el.dataset.qty,
                "type": el.dataset.type,
            };
            let cart = await addItemToCart(body);
            if (!cart) return;
            refreshCards(cart);
        });
    });
}

switch (window.location.pathname) {
    case "/menu.php":
        menuPage();
        break;
    default:
        break;
}
