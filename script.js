// Automatically set today's date
const dateInput = document.getElementById('date');
dateInput.value = new Date().toISOString().slice(0, 10);

const expenseForm = document.getElementById('expense-form');
const expenseTable = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
const saveReportButton = document.getElementById('save-report');
const categorySelect = document.getElementById('category');

// Load saved expenses from localStorage
const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
savedExpenses.forEach(expense => addExpenseRow(expense));

// Add expense to table and save to localStorage
expenseForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const expense = {
        date: dateInput.value,
        category: categorySelect.value,
        amount: parseFloat(document.getElementById('amount').value),
        remarks: document.getElementById('remarks').value
    };

    // If "Add New" is selected, prompt for a new category
    if (expense.category === 'Add New') {
        const newCategory = prompt('Enter new category:');
        if (newCategory) {
            const option = document.createElement('option');
            option.value = newCategory;
            option.textContent = newCategory;
            categorySelect.appendChild(option);
            expense.category = newCategory;
        } else {
            return; // Exit if no new category is added
        }
    }

    addExpenseRow(expense);
    savedExpenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(savedExpenses));
    expenseForm.reset();
    dateInput.value = new Date().toISOString().slice(0, 10); // Reset today's date
});

// Add an expense row to the table
function addExpenseRow(expense) {
    const row = expenseTable.insertRow();
    Object.values(expense).forEach(value => {
        const cell = row.insertCell();
        cell.textContent = value;
    });
}

// Save monthly report as a CSV file
saveReportButton.addEventListener('click', function () {
    if (savedExpenses.length === 0) {
        alert('No expenses to save.');
        return;
    }

    const csvContent = 'Date,Category,Amount,Remarks\n' +
        savedExpenses.map(expense =>
            `${expense.date},${expense.category},${expense.amount},${expense.remarks}`
        ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Monthly_Report.csv';
    a.click();
    URL.revokeObjectURL(url);

    // Clear all entries after saving
    localStorage.removeItem('expenses');
    while (expenseTable.rows.length > 0) {
        expenseTable.deleteRow(0);
    }
    alert('Report saved and all entries cleared.');
});