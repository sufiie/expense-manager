
const form = document.getElementById('expense-form');
const tableBody = document.querySelector('#expense-table tbody');
const totalDisplay = document.getElementById('total');

let total = 0;

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!date || !category || isNaN(amount)) return;

    const row = document.createElement('tr');
    row.innerHTML = `<td>${date}</td><td>${category}</td><td>₹${amount.toFixed(2)}</td>`;
    tableBody.appendChild(row);

    total += amount;
    totalDisplay.textContent = total.toFixed(2);

    form.reset();
});
