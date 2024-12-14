document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('medicine-container')) {
        fetch('medicines.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                renderMedicines(data);
                setupCartFunctionality(data);
            })
            .catch(error => console.error('Error loading medicines:', error));
    }

    if (document.getElementById('pay')) {
        const payButton = document.getElementById('pay');
        payButton.addEventListener('click', handlePayment);
    }

    if (document.getElementById('order-summary-body')) {
        populateOrderSummary();
    }
});

function renderMedicines(medicines) {
    const container = document.getElementById("medicine-container");

    const categories = {
        Analgesics: [1, 2, 3, 4, 5, 6],
        Antibiotics: [7, 8, 9, 10, 11, 12],
        Antidepressants: [13, 14, 15, 16, 17, 18],
        Antihistamines: [19, 20, 21, 22, 23, 24],
        Antihypertensives: [25, 26, 27, 28, 29, 30]
    };

    for (const [category, ids] of Object.entries(categories)) {
        const categoryHeading = document.createElement("h2");
        categoryHeading.className = "ph-h2";
        categoryHeading.textContent = category;
        container.appendChild(categoryHeading);

        const categoryContainer = document.createElement("div");
        categoryContainer.className = "category-container";
        container.appendChild(categoryContainer);

        ids.forEach(id => {
            const medicine = medicines.find(med => med.id === id);
            if (medicine) {
                const box = document.createElement("div");
                box.className = "medicine-card";

                box.innerHTML = `
                    <img src="${medicine.img}" alt="${medicine.name}">
                    <h3>${medicine.name}</h3>
                    <p>Price: ${medicine.price} per tablet</p>
                    <label>Quantity: <input type="number" min="1" value="1" class="quantity"></label><br>
                    <button class="add-to-cart">Add to Cart</button>
                `;

                categoryContainer.appendChild(box);
            }
        });
    }
}

function setupCartFunctionality(medicines) {
    const cartButtons = document.querySelectorAll(".add-to-cart");
    const tableBody = document.querySelector("table.table-content tbody");
    const grandTotalElement = document.getElementById("grand-total");

    function addItem(event) {
        event.preventDefault();

        const medicineCard = event.target.closest(".medicine-card");
        const name = medicineCard.querySelector("h3").textContent.trim();
        console.log(`Adding item: ${name}`); // Log the name of the medicine being added
        const quantity = parseInt(medicineCard.querySelector(".quantity").value);
        const medicine = medicines.find(med => med.name === name);

        if (!medicine) {
            console.error(`Medicine not found: ${name}`);
            alert(`Medicine not found: ${name}`);
            return;
        }

        const price = parseFloat(medicine.price);
        const total = price * quantity;

        const existingRow = [...tableBody.rows].find(row => row.cells[0].textContent === name);
        if (existingRow) {
            const currentQuantity = parseInt(existingRow.cells[1].querySelector('input').value);
            const newQuantity = currentQuantity + quantity;
            existingRow.cells[1].querySelector('input').value = newQuantity;
            existingRow.cells[3].textContent = `Rs.${price * newQuantity}/=`;
        } else {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${name}</td>
                <td><input type="number" min="1" value="${quantity}" class="cart-quantity"></td>
                <td>Rs.${price}/=</td>
                <td>Rs.${total}/=</td>
                <td><button class="remove-from-cart">Remove</button></td>
            `;
            tableBody.appendChild(row);
        }

        updateGrandTotal();
        alert(`${name} has been added to your cart`);

        // Save cart items to local storage
        saveCartItems();
    }

    function updateGrandTotal() {
        let grandTotal = 0;
        [...tableBody.rows].forEach(row => {
            const total = parseFloat(row.cells[3].textContent.replace('Rs.', '').replace('/=', ''));
            grandTotal += total;
        });
        grandTotalElement.textContent = `Rs.${grandTotal}/=`;
    }

    function removeItem(event) {
        const row = event.target.closest("tr");
        row.remove();
        updateGrandTotal();
        alert("Item has been removed from your cart");

        // Update local storage
        saveCartItems();
    }

    function resetCart() {
        tableBody.innerHTML = "";
        updateGrandTotal();
        alert("Cart has been reset!");
        localStorage.removeItem('cartItems');
        populateOrderSummary(); // Clear the order summary as well
    }

    function addToFavourites() {
        const cartItems = [...tableBody.rows];
        if (cartItems.length === 0) {
            alert("Your cart is empty. Cannot add to favourites.");
            return;
        }

        const favourites = cartItems.map(row => ({
            name: row.cells[0].textContent,
            quantity: parseInt(row.cells[1].querySelector('input').value),
            price: parseFloat(row.cells[2].textContent.replace('Rs.', '').replace('/=', ''))
        }));
        localStorage.setItem('favourites', JSON.stringify(favourites));
        alert("Favourites have been saved!");
    }

    function applyFavourites() {
        const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        if (favourites.length === 0) {
            alert("No favourites found.");
            return;
        }

        tableBody.innerHTML = "";
        favourites.forEach(fav => {
            const row = document.createElement("tr");
            const total = fav.price * fav.quantity;
            row.innerHTML = `
                <td>${fav.name}</td>
                <td><input type="number" min="1" value="${fav.quantity}" class="cart-quantity"></td>
                <td>Rs.${fav.price}/=</td>
                <td>Rs.${total}/=</td>
                <td><button class="remove-from-cart">Remove</button></td>
            `;
            tableBody.appendChild(row);
        });
        updateGrandTotal();
        alert("Favourites have been applied!");

        // Save favourites to local storage as cart items
        saveCartItems();
        populateOrderSummary(); // Update the order summary
    }

    function resetFavourites() {
        localStorage.removeItem('favourites');
        alert("Favourites have been reset!");
    }

    function saveCartItems() {
        const cartItems = [...tableBody.rows].map(row => ({
            name: row.cells[0].textContent,
            quantity: parseInt(row.cells[1].querySelector('input').value),
            price: parseFloat(row.cells[2].textContent.replace('Rs.', '').replace('/=', ''))
        }));
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    function updateQuantity(event) {
        const input = event.target;
        const row = input.closest("tr");
        const price = parseFloat(row.cells[2].textContent.replace('Rs.', '').replace('/=', ''));
        const quantity = parseInt(input.value);
        const total = price * quantity;
        row.cells[3].textContent = `Rs.${total}/=`;
        updateGrandTotal();
        saveCartItems();
    }

    cartButtons.forEach(button => {
        button.addEventListener("click", addItem);
    });

    tableBody.addEventListener("click", event => {
        if (event.target.classList.contains("remove-from-cart")) {
            removeItem(event);
        }
    });

    tableBody.addEventListener("input", event => {
        if (event.target.classList.contains("cart-quantity")) {
            updateQuantity(event);
        }
    });

    const resetButton = document.getElementById("reset_cart");
    resetButton.addEventListener("click", resetCart);

    const addToFavButton = document.getElementById("addTo_fav");
    addToFavButton.addEventListener("click", addToFavourites);

    const applyFavButton = document.getElementById("apply_fav");
    applyFavButton.addEventListener("click", applyFavourites);

    const resetFavButton = document.getElementById("reset_fav");
    resetFavButton.addEventListener("click", resetFavourites);
}

function handlePayment(event) {
    event.preventDefault();

    const name = document.getElementById('name1').value;
    const email = document.getElementById('email1').value;
    const contact = document.getElementById('contact1').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postal = document.getElementById('postal').value;
    const card = document.getElementById('card').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    if (!name || !email || !contact || !address || !city || !postal || !card || !expiry || !cvv) {
        alert('Please fill in all the required fields.');
        return;
    }

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (cartItems.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const orderSummary = cartItems.map(item => `${item.name} (x${item.quantity})`).join(', ');
    const grandTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // Assuming delivery takes 7 days

    alert(`Thank you for your purchase! Your order: ${orderSummary}. Total: Rs.${grandTotal}/=. Delivery Date: ${deliveryDate.toDateString()}`);
    
    // Clear the cart after purchase
    localStorage.removeItem('cartItems');
    populateOrderSummary(); // Clear the order summary as well

    // Clear the billing form
    document.querySelector('.registration-form form').reset();
}

function populateOrderSummary() {
    const orderSummaryBody = document.getElementById('order-summary-body');
    const orderGrandTotal = document.getElementById('order-grand-total');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    orderSummaryBody.innerHTML = ""; // Clear the order summary body

    let grandTotal = 0;
    cartItems.forEach(item => {
        const total = item.price * item.quantity;
        grandTotal += total;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>Rs.${item.price}/=</td>
            <td>Rs.${total}/=</td>
        `;
        orderSummaryBody.appendChild(row);
    });

    orderGrandTotal.textContent = `Rs.${grandTotal}/=`;
}