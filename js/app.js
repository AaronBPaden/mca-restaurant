"use strict";
const db = {
    entrees: [
        {
            id: 0,
            name: "Bare Minimum Burger",
            desc: "Meat. Cheese. Icegburg lettice. American cheese. A slice of tomato. A pickle or two if we remember. It's not good but it is cheap.",
            price: 3.99,
            img: "media/menu/burger.jpg",
        },
        {
            id: 1,
            name: "Grilled Chicken",
            desc: "This is chicken the way God intended",
            price: 10.99,
            img: "media/menu/chicken.jpg",
        },
        {
            id: 2,
            name: "Chicken Strips",
            desc: "Kind of like chicken nuggets, but good",
            price: 4.99,
            img: "media/menu/chicken-strips.jpg",
        },
        {
            id: 3,
            name: "Spicy Reuben",
            desc: `If you ever wondered what the best sandwhich was, this is it.
                Corned beef and saurkraut on rye bread with a smokey chipotle sauce. None of that Thousand Isles nonsense.`,
            price: 8.99,
            img: "media/menu/reuben.jpg",
        },
        {
            id: 4,
            name: "Steak",
            desc: "A steak. Grilled how you like it.",
            price: 15.99,
            img: "media/menu/steak.jpg",
        },
        {
            id: 5,
            name: "Stuffed Peppers",
            desc: "Bell peppers stuffed to the brim with good stuff and baked.",
            price: 8.99,
            img: "media/menu/stuffed-peppers.jpg",
        },
    ],
    sides: [
        {
            id: 0,
            name: "Baked Potato",
            desc: "You know what this is. You want sour cream or not?",
            price: 2.99,
            img: "media/menu/baked-potato.jpg",
        },
        {
            id: 1,
            name: "Glazed Carrots",
            desc: "What was once a healthy snack, turned into a delicious sugary dessert. Except it doesn't actually count as a dessert. Neat!",
            price: 3.99,
            img: "media/menu/carrots.jpg",
        },
        {
            id: 2,
            name: "Fries",
            desc: `Instead of baking the potatoes, we cut them into strips and fry them in copious amounts of grease,
                then blanked them in salt so they taste good. Complementary high fructose corn syrup and tomato sauce is provided free of charge.`,
            price: 3.99,
            img: "media/menu/fries.jpg",
        },
        {
            id: 3,
            name: "Fruit",
            desc: "Seasonal (sometimes) fruit. Part of a balanced diet",
            price: 4.99,
            img: "media/menu/fruit.jpg",
        },
        {
            id: 4,
            name: "Mashed potatoes",
            desc: "More potatoes. This time we smash them up and mix them with milk. It's pretty great!",
            price: 4.99,
            img: "media/menu/mashed-potatoes.jpg",
        },
        {
            id: 5,
            name: "Salad",
            desc: "Edible vegetables mixed together with vinegar and oil. Good stuff. Requests for Ranch Dressing are not accepted or tolerated.",
            price: 3.99,
            img: "media/menu/salad.jpg",
        },
    ],
};

class Menu {
    constructor() {
        for (const key in db.entrees) {
            this.populateCard(db.entrees[key], 'entree')
        }
        for (const key in db.sides) {
            this.populateCard(db.sides[key], 'side');
        }
        document.getElementById('checkoutButton').addEventListener('click', this.onCheckout.bind(this));
    }

    /*
     * When clicking a menu-card, check if the user is actually clicking on the remove button first.
     */
    handleClick(event) {
        if (event.target.classList.contains('remove-button')) {
            this.removeOnClick(event);
        } else {
            this.cardOnClick(event);
        }
    }

    /*
     * Generate HTML for an itemized list of orders
     */
    populateCheckoutLists(listElement, card, dbArray) {
        let qty = parseInt(card.querySelector('.item-quantity').innerText);
        let id = card.dataset.id;
        let li = document.createElement('li');
        li.className = 'checkout-list-item';
        li.innerHTML = `
            <span class="checkout-item-name">${dbArray[id].name}</span>
            <div class="checkout-item-price">
                <span>${qty} ordered - </span>
                <span class="item-subtotal">${(dbArray[id].price*qty).toFixed(2)}</span>
            </div>`;
        listElement.append(li);
    }

    /*
     * Calculate total and generate HTML for checkout.
     */
    populateTotal() {
        let subtotal = Array.from(document.querySelectorAll('.item-subtotal'))
            .map(e => parseFloat(e.innerText))
            .reduce((total, amount) => total+amount);
        let tax = (subtotal*0.07);
        document.getElementById('subtotalSubtotal').innerText = subtotal.toFixed(2);
        document.getElementById('subtotalTax').innerText = tax.toFixed(2);
        document.getElementById('completedTotal').innerText = (subtotal + tax).toFixed(2);
        document.getElementById('checkoutPage').classList.remove('d-none');
    }

    /*
     * Build the checkout page.
     */
    onCheckout(event) {
        // Filter for ordered entrees and sides with a quantity greater than zero.
        let orderedEntrees = Array.from(document.querySelectorAll('#entreeMenu > .menu-card'))
            .filter(e => parseInt(e.querySelector('.item-quantity').innerText) > 0);
        let orderedSides = Array.from(document.querySelectorAll('#sideMenu > .menu-card'))
            .filter(e => parseInt(e.querySelector('.item-quantity').innerText) > 0);

        document.getElementById('menuPage').classList.add('d-none');

        if (orderedEntrees.length > 0) {
            document.getElementById('checkoutEntrees').classList.remove('d-none');
            let list = document.getElementById('entreesList');
            orderedEntrees.forEach((e) => {
                this.populateCheckoutLists(list, e, db.entrees);
            });
        }
        if (orderedSides.length > 0) {
            document.getElementById('checkoutSides').classList.remove('d-none');
            let list = document.getElementById('sidesList');
            orderedSides.forEach((e) => {
                this.populateCheckoutLists(list, e, db.sides);
            });
        }

        this.populateTotal();
    }

    /*
     * Increment quantity.
     * Set quantity text.
     * Unhide remove button and checkout button.
     */
    cardOnClick(event) {
        let card = event.currentTarget;
        let qtySpan = card.querySelector('.item-quantity');
        let qty = qtySpan.innerText === "" ? 0 : qtySpan.innerText;
        qty++;
        qtySpan.innerText = qty;
        card.querySelector('.remove-button').classList.remove('d-none');
        document.getElementById('checkoutButton').classList.remove('d-none');
    }

    /*
     * Decrement item quantity.
     * Set quantity text.
     * Hide button again if quantity is 0.
     */
    removeOnClick(event) {
        let button = event.target;
        let card = document.querySelector(`#${button.dataset.type}Menu > .menu-card[data-id='${button.dataset.id}']`);
        let qtySpan = card.querySelector('.item-quantity');
        if (qtySpan.innerText === "") {
            console.log(`error: remove button should not be clickable with 0 quantity. TYPE: ${button.dataset.type} ID: ${button.dataset.id}`);
            return;
        }
        let qty = parseInt(qtySpan.innerText);
        qty = Math.max(0, qty - 1);
        if (qty === 0) {
            qtySpan.innerText = "";
            button.classList.add('d-none');
        } else {
            qtySpan.innerText = qty;
        }
    }

    /* Create a card element and hook up event listener. */
    populateCard(item, type) {
        let menu = type === 'entree' ? document.getElementById('entreeMenu') : document.getElementById('sideMenu');
        let card = document.createElement('div');
        card.className = 'content-box menu-card';
        card.dataset.type = type 
        card.dataset.id = item.id;
        card.dataset.quantity = 0;
        card.insertAdjacentHTML('beforeend', `
            <img class="img-fluid" src="${item.img}" alt="${item.name}">
            <button class="remove-button btn btn-dark d-none" data-id="${item.id}" data-type="${type}">−</button>
            <div class="content-box-text">
                <h3>${item.name}</h3>
                <p>
                    ${item.desc}
                </p>
                <p class="card-price">
                    <span class="item-quantity"></span> — $${item.price}
                </p>
            </div>`);
        card.addEventListener('click', this.handleClick.bind(this));
        menu.append(card);
    }
}

const initPages = () => {
    let menu = new Menu();
    document.getElementById('menuButton').addEventListener('click', (event) => {
        document.getElementById('homePage').classList.toggle('d-none');
        document.getElementById('menuPage').classList.toggle('d-none');
    });
}

initPages();
