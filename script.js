// Automatically set today's date in DD-MM-YYYY format
const dateInput = document.getElementById('date');
const today = new Date();
dateInput.value = formatDateToYYYYMMDD(today);

const expenseForm = document.getElementById('expense-form');
const expenseTable = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
const viewReportButton = document.getElementById('view-report');
const categorySelect = document.getElementById('category');
const filterCategory = document.getElementById('filter-category');

// Load saved expenses from localStorage
let savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
savedExpenses.forEach((expense, index) => addExpenseRow(expense, index));

// Add expense to table and save to localStorage
expenseForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const expense = {
        date: formatDateToDDMMYYYY(new Date(dateInput.value)),
        category: categorySelect.value,
        amount: parseFloat(document.getElementById('amount').value),
        remarks: document.getElementById('remarks').value
    };

    savedExpenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(savedExpenses));
    addExpenseRow(expense, savedExpenses.length - 1);
    expenseForm.reset();
    dateInput.value = formatDateToYYYYMMDD(today); // Reset to today's date
});

// Filter expenses by category
filterCategory.addEventListener('change', function () {
    const selectedCategory = filterCategory.value;
    const filteredExpenses = selectedCategory
        ? savedExpenses.filter(expense => expense.category === selectedCategory)
        : savedExpenses;

    updateExpenseTable(filteredExpenses);
});

// Add an expense row to the table
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
        updateExpenseTable(savedExpenses);
    });
    deleteCell.appendChild(deleteButton);
}

// Update the expense table with filtered or all expenses
function updateExpenseTable(expenses) {
    expenseTable.innerHTML = '';
    expenses.forEach((expense, index) => addExpenseRow(expense, index));
}

// Redirect to the reports page
viewReportButton.addEventListener('click', function () {
    window.location.href = 'monthly-report.html';
});

// Utility function to format date to DD-MM-YYYY
function formatDateToDDMMYYYY(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Utility function to format date to YYYY-MM-DD for input field
function formatDateToYYYYMMDD(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}