// let items = document.getElementsByClassName('cart');

// function addItem() {
//     let name = document.querySelector('.h3').textContent; // Use querySelector for a single element
//     let quantity = document.querySelector('.quantity1').value; // Ensure it's a single element
//     let tableBody = document.querySelector('tbody'); // Select the first tbody
//     let row = document.createElement('tr');
//     let price = 5.00;
//     let total = price * quantity;

//     // Fill the row
//     row.innerHTML = `<td>${name}</td><td>${quantity}</td><td>${price}</td><td>${total}</td>`;
    
//     // Append to the table body
//     tableBody.appendChild(row);

//     // Alert
//     alert(`${name} has been added to your cart`);
// }

// // Attach the event listener to each "cart" element
// for (let i = 0; i < items.length; i++) {
//     items[i].addEventListener('click', addItem);
// }

document.addEventListener("DOMContentLoaded", () => {
    // Select all "Add to cart" buttons
    const cartButtons = document.querySelectorAll(".cart");

    // Get the table body where the cart items will be added
    const tableBody = document.querySelector("table.table-content tbody");

    // Function to add item to the cart
    function addItem(event) {
        event.preventDefault();

        // Find the parent drug box for the clicked button
        const drugBox = event.target.closest(".pharmacy-box");

        // Get the medicine name, quantity, and price
        const name = drugBox.querySelector(".h3").textContent.trim();
        const quantity = drugBox.querySelector(".quantity1").value;
        const price = 1; // Assuming Rs.1/= per tablet
        const total = price * quantity;

        // Check if the item already exists in the cart
        const existingRow = [...tableBody.rows].find(row => row.cells[0].textContent === name);
        if (existingRow) {
            // Update the quantity and total for the existing item
            const currentQuantity = parseInt(existingRow.cells[1].textContent);
            const newQuantity = currentQuantity + parseInt(quantity);
            existingRow.cells[1].textContent = newQuantity;
            existingRow.cells[3].textContent = price * newQuantity;
        } else {
            // Create a new row for the cart
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${name}</td>
                <td>${quantity}</td>
                <td>Rs.${price}/=</td>
                <td>Rs.${total}/=</td>
            `;
            tableBody.appendChild(row);
        }

        // Notify the user
        alert(`${name} has been added to your cart`);
    }

    // Attach the event listener to all cart buttons
    cartButtons.forEach(button => {
        button.addEventListener("click", addItem);
    });

    // Reset the cart when the "Reset" button is clicked
    const resetButton = document.getElementById("Reset");
    resetButton.addEventListener("click", () => {
        tableBody.innerHTML = ""; // Clear all rows in the table body
        alert("Cart has been reset!");
    });
});
