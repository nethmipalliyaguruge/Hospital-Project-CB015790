let pay = document.getElementById('pay');

function f_alert(){
    alert('Thank you for your purchase!')
}

pay.addEventListener('click', f_alert);

// alert(`Thank you for your purchase! Your order: ${orderSummary}. Total: ${grandTotal}. Delivery Date: ${deliveryDate.toDateString()}`);