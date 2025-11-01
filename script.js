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
 
// --- REVISED FUNCTION: updateExpenseTable() ---
// Update the expense table with sorted entries
function updateExpenseTable() {
expenseTable.innerHTML = '';
const selectedCategory = filterCategory.value;

// Filter expenses by currency and category
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
// Fallback to original array order for same-day entries (newest last in 'savedExpenses')
return savedExpenses.indexOf(b) - savedExpenses.indexOf(a);
}
return dateB - dateA; // Sort by date descending
});
 
// **CRITICAL CHANGE HERE:** Find the original index of the expense in savedExpenses
filteredExpenses.forEach((expense) => {
// Find the index of this expense object within the main, unsorted 'savedExpenses' array.
const originalIndex = savedExpenses.findIndex(item => item === expense);
// Pass the expense object and its true index to the row creation function.
addExpenseRow(expense, originalIndex);
});
}
// ----------------------------------------------------
 
 
// --- REVISED FUNCTION: addExpenseRow() ---
// Add a new expense row to the table
function addExpenseRow(expense, index) { // 'index' is now the ORIGINAL index in savedExpenses
const row = expenseTable.insertRow();

// Insert data cells
// NOTE: Object.values(expense) must return values in the order: date, category, amount, currency, remarks
Object.values(expense).forEach(value => {
const cell = row.insertCell();
// Handle number formatting if necessary (optional)
if (typeof value === 'number') {
cell.textContent = value.toFixed(2);
} else {
cell.textContent = value;
}
});
 
// Add Delete button
const deleteCell = row.insertCell();
const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.className = 'delete-button';

// **CRITICAL CHANGE 1: Store the original array index on the button**
deleteButton.setAttribute('data-index', index);
 
// **CRITICAL CHANGE 2: Retrieve the index from the button on click**
deleteButton.addEventListener('click', function (event) {
// Read the stored index from the button's data attribute
const indexToDelete = parseInt(event.currentTarget.dataset.index);
 
if (!isNaN(indexToDelete)) {
// Use the correct index to splice the original array
savedExpenses.splice(indexToDelete, 1);

// Save the updated array to localStorage
localStorage.setItem('expenses', JSON.stringify(savedExpenses));

// Redraw the table (which re-filters/sorts/updates the UI)
updateExpenseTable();
}
});
deleteCell.appendChild(deleteButton);
}
// ----------------------------------------------------
 
 
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