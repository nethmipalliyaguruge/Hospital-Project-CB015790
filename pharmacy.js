document.addEventListener('DOMContentLoaded', () => {
    fetch('medicines.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => renderMedicines(data))
        .catch(error => console.error('Error loading medicines:', error));
});

function renderMedicines(medicines) {
    const container = document.getElementById("medicine-container");

      medicines.forEach((medicine, index) => {
        const box = document.createElement("div");
        box.className = "medicine-card";

        box.innerHTML = `
          <img src="${medicine.image}" alt="${medicine.name}">
          <h3>${medicine.name} (${medicine.dose})</h3>
          <p>Price: ${medicine.price} per tablet</p>
          <label>Quantity: <input type="number" min="1" value="1"></label><br>
          <button>Add to Cart</button>
        `;

        container.appendChild(box);
    });
}

// document.addEventListener("DOMContentLoaded", () => {
//     // Select all "Add to cart" buttons
//     const cartButtons = document.querySelectorAll(".cart");

//     // Get the table body where the cart items will be added
//     const tableBody = document.querySelector("table.table-content tbody");

//     // Function to add item to the cart
//     function addItem(event) {
//         event.preventDefault();

//         // Find the parent drug box for the clicked button
//         const drugBox = event.target.closest(".pharmacy-box");

//         // Get the medicine name, quantity, and price
//         const name = drugBox.querySelector(".h3").textContent.trim();
//         const quantity = drugBox.querySelector(".quantity1").value;
//         const price = 1; // Assuming Rs.1/= per tablet
//         const total = price * quantity;

//         // Check if the item already exists in the cart
//         const existingRow = [...tableBody.rows].find(row => row.cells[0].textContent === name);
//         if (existingRow) {
//             // Update the quantity and total for the existing item
//             const currentQuantity = parseInt(existingRow.cells[1].textContent);
//             const newQuantity = currentQuantity + parseInt(quantity);
//             existingRow.cells[1].textContent = newQuantity;
//             existingRow.cells[3].textContent = price * newQuantity;
//         } else {
//             // Create a new row for the cart
//             const row = document.createElement("tr");
//             row.innerHTML = `
//                 <td>${name}</td>
//                 <td>${quantity}</td>
//                 <td>Rs.${price}/=</td>
//                 <td>Rs.${total}/=</td>
//             `;
//             tableBody.appendChild(row);
//         }

//         // Notify the user
//         alert(`${name} has been added to your cart`);
//     }

//     // Attach the event listener to all cart buttons
//     cartButtons.forEach(button => {
//         button.addEventListener("click", addItem);
//     });

//     // Reset the cart when the "Reset" button is clicked
//     const resetButton = document.getElementById("Reset");
//     resetButton.addEventListener("click", () => {
//         tableBody.innerHTML = ""; // Clear all rows in the table body
//         alert("Cart has been reset!");
//     });
// });