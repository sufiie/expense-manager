// Automatically set today's date
const dateInput = document.getElementById('date');
const currencySelector = document.getElementById('currency-selector');
const expenseForm = document.getElementById('expense-form');
const expenseTable = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
const filterCategory = document.getElementById('filter-category');
const viewReportButton = document.getElementById('view-report');

const today = new Date();
dateInput.value = formatDateToYYYYMMDD(today);

// Load saved expenses and last used currency
let savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
let currentCurrency = localStorage.getItem('currentCurrency') || currencySelector.value; // Default to last used currency
currencySelector.value = currentCurrency;

// Update the expense table based on filters
function updateExpenseTable() {
    expenseTable.innerHTML = '';
    const selectedCategory = filterCategory.value;
    const filteredExpenses = savedExpenses.filter(expense => {
        return (
            expense.currency === currentCurrency &&
            (selectedCategory ? expense.category === selectedCategory : true)
        );
    });

    // Sort expenses by date (descending) and today's entries at the top
    filteredExpenses.sort((a, b) => {
        const dateA = new Date(a.date.split('-').reverse().join('-'));
        const dateB = new Date(b.date.split('-').reverse().join('-'));
        if (dateA.getTime() === dateB.getTime()) {
            return savedExpenses.indexOf(b) - savedExpenses.indexOf(a); // Keep latest entries of the same date at the top
        }
        return dateB - dateA;
    });

    filteredExpenses.forEach((expense, index) => addExpenseRow(expense, index));
}

// Add a new expense row to the table
function addExpenseRow(expense, index) {
    const row = expenseTable.insertRow();
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
        savedExpenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(savedExpenses));
        updateExpenseTable();
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

// Handle currency change and category filter
currencySelector.addEventListener('change', function () {
    currentCurrency = currencySelector.value;
    localStorage.setItem('currentCurrency', currentCurrency); // Save the selected currency to localStorage
    updateExpenseTable();
});

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