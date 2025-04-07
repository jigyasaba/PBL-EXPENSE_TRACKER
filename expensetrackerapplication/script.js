document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category-select');
    const amountInput = document.getElementById('amount-input');
    const dateInput = document.getElementById('date-input');
    const addBtn = document.getElementById('add-btn');
    const expenseTableBody = document.getElementById('expense-table-body');
    const totalAmountCell = document.getElementById('total-amount');

    let totalAmount = 0;

    function updateTotal(amountChange) {
        totalAmount += amountChange;
        totalAmountCell.textContent = totalAmount.toFixed(2);
    }

    function createExpenseRow(expense) {
        const newRow = expenseTableBody.insertRow();
        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();
        const dateCell = newRow.insertCell();
        const deleteCell = newRow.insertCell();

        categoryCell.textContent = expense.category;
        amountCell.textContent = expense.amount;
        dateCell.textContent = expense.date;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            fetch('delete_expense.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `id=${expense.id}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    updateTotal(-expense.amount);
                    expenseTableBody.removeChild(newRow);
                }
            });
        });

        deleteCell.appendChild(deleteBtn);
        updateTotal(parseFloat(expense.amount));
    }

    function loadExpenses() {
        fetch('get_expenses.php')
            .then(response => response.json())
            .then(data => {
                data.forEach(exp => createExpenseRow(exp));
            });
    }

    addBtn.addEventListener('click', () => {
        const category = categorySelect.value;
        const amount = parseFloat(amountInput.value);
        const date = dateInput.value;

        if (!category || isNaN(amount) || amount <= 0 || !date) {
            alert("Please fill all fields correctly.");
            return;
        }

        fetch('add_expense.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `category=${category}&amount=${amount}&date=${date}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                createExpenseRow({ id: data.id, category, amount, date });
                amountInput.value = '';
                dateInput.value = '';
            }
        });
    });

    loadExpenses();
});
