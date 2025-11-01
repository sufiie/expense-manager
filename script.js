// Automatically set today's date
const dateInput = document.getElementById('date');
const currencySelector = document.getElementById('currency-selector');
const expenseForm = document.getElementById('expense-form');
const expenseTable = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
const filterCategory = document.getElementById('filter-category');
const viewReportButton = document.getElementById('view-report');
 
const today = new Date();
dateInput.value = formatDateToYYYYMMDD(today);
 
// Load saved expenses and last selected currency
let savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
let currentCurrency = localStorage.getItem('currentCurrency') || currencySelector.value;
currencySelector.value = currentCurrency;
 
// Update the expense table with sorted entries
function updateExpenseTable() {
expenseTable.innerHTML = '';
const selectedCategory = filterCategory.value;
const filteredExpenses = savedExpenses.filter(expense => {
return (
expense.currency === currentCurrency &&
(selectedCategory ? expense.category === selectedCategory : true)
);
});
 
// Sort entries: today's entries first, then by most recent
filteredExpenses.sort((a, b) => {
const dateA = new Date(a.date.split('-').reverse().join('-'));
const dateB = new Date(b.date.split('-').reverse().join('-'));
if (dateA.getTime() === dateB.getTime()) {
// Use the index in the original savedExpenses array for stable sorting on the same day
return savedExpenses.indexOf(b) - savedExpenses.indexOf(a);
}
return dateB - dateA;
});
 
// NOTE: We no longer pass the unreliable 'index' from the filtered array
filteredExpenses.forEach(expense => addExpenseRow(expense));
}
 
// Add a new expense row to the table
function addExpenseRow(expense) {
const row = expenseTable.insertRow();
// **IMPORTANT FIX**: Store the full expense data on the row for reliable deletion
row.expenseData = expense;

// Insert cells for expense properties
Object.values(expense).forEach(value => {
const cell = row.insertCell();
cell.textContent = value;
});
 
// Add Delete button
const deleteCell = row.insertCell();
const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.className = 'delete-button';
deleteButton.addEventListener('click', function () {
// Retrieve the data stored on the row
const expenseToDelete = row.expenseData;
 
// **CORRECTED DELETION LOGIC**: Find the item's index in the ORIGINAL savedExpenses array
const indexToDelete = savedExpenses.findIndex(item =>
item.date === expenseToDelete.date &&
item.category === expenseToDelete.category &&
item.amount === expenseToDelete.amount &&
item.currency === expenseToDelete.currency &&
item.remarks === expenseToDelete.remarks
);
 
if (indexToDelete > -1) {
savedExpenses.splice(indexToDelete, 1); // Delete the correct expense
localStorage.setItem('expenses', JSON.stringify(savedExpenses));
updateExpenseTable(); // Re-render the table
} else {
console.error("Expense to delete was not found in the main expense list.");
}
});
deleteCell.appendChild(deleteButton);
}
 
// Add new expense
expenseForm.addEventListener('submit', function (event) {
event.preventDefault();
const expense = {
date: formatDateToDDMMYYYY(new Date(dateInput.value)),
category: document.getElementById('category').value,
amount: parseFloat(document.getElementById('amount').value),
currency: currentCurrency,
remarks: document.getElementById('remarks').value
};
 
savedExpenses.push(expense);
localStorage.setItem('expenses', JSON.stringify(savedExpenses));
updateExpenseTable();
expenseForm.reset();
dateInput.value = formatDateToYYYYMMDD(today); // Reset to today's date
});
 
// Handle currency change and save it
currencySelector.addEventListener('change', function () {
currentCurrency = currencySelector.value;
localStorage.setItem('currentCurrency', currentCurrency); // Save the selected currency
updateExpenseTable();
});
 
// Handle category filter
filterCategory.addEventListener('change', function () {
updateExpenseTable();
});
 
// Redirect to reports page
viewReportButton.addEventListener('click', function () {
window.location.href = 'monthly-report.html';
});
 
// Utility functions for date formatting
function formatDateToDDMMYYYY(date) {
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0');
const year = date.getFullYear();
return `${day}-${month}-${year}`;
}
 
function formatDateToYYYYMMDD(date) {
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0');
const year = date.getFullYear();
return `${year}-${month}-${day}`;
}
 
// Initialize table
updateExpenseTable();