"use strict";

const fetchData = async function(url, body) {
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
        console.log("text", text);
        return JSON.parse(text).cart;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const menuPage = () => {
    let cards = document.querySelectorAll('.menu-card');
    const setQuantity = (e, n) => {
        e.dataset.qty = n;
        e.querySelector(".item-qty").innerText = n;
    }
    const refreshCards = (cart) => {
        cards.forEach((e) => {
            let i = Array.from(cart).findIndex((el) => el.id === e.dataset.id && el.type === e.dataset.type);
            if (i === -1) {
                setQuantity(e, 0);
                return;
            };
            setQuantity(e, cart[i].qty);
        });
    }
    cards.forEach((el) => {
        el.addEventListener("click", async function(ev) {
            let body = {
                "id": el.dataset.id,
                "qty": el.dataset.qty,
                "type": el.dataset.type,
            };
            console.log("body", body);
            let cart = await fetchData('add-item-to-cart.php', body);
            if (!cart) return;
            console.log("response", cart);
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
