document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category-select');
    const amountInput = document.getElementById('amount-input');
    const dateInput = document.getElementById('date-input');
    const addBtn = document.getElementById('add-btn');
    const expenseTableBody = document.getElementById('expense-table-body');
    const totalAmountCell = document.getElementById('total-amount')
    const undoBtn = document.getElementById('undo-btn');
    const deletedStack = []; // ← DSA: Stack for undo
    let totalAmount = 0;
    const categoryTotals = {}; // Track category-wise totals
    const categoryTotalsList = document.getElementById('category-totals-list');
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
       // Modify delete logic to store deleted item in stack
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
            updateCategoryTotal(expense.category, -expense.amount);
            expenseTableBody.removeChild(newRow);

            // Push the deleted item to stack
            deletedStack.push(expense);
        }
    });
});

        deleteCell.appendChild(deleteBtn);
        updateTotal(parseFloat(expense.amount));
        updateCategoryTotal(expense.category, parseFloat(expense.amount));
    }

    function loadExpenses() {
        fetch('get_expenses.php')
            .then(response => response.json())
            .then(data => {
                data.forEach(exp => createExpenseRow(exp));
                data.forEach(exp => {
                    createExpenseRow(exp);
                    updateCategoryTotal(exp.category, parseFloat(exp.amount));
                });
                
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
// Add undo functionality
   undoBtn.addEventListener('click', () => {
   
   if (deletedStack.length === 0) {
        alert("Nothing to undo.");
        return;
    }

    const lastDeleted = deletedStack.pop();

    fetch('add_expense.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `category=${lastDeleted.category}&amount=${lastDeleted.amount}&date=${lastDeleted.date}`
    })
     .then(response => response.json())
     .then(data => {
        if (data.status === 'success') {
            lastDeleted.id = data.id;
            createExpenseRow(lastDeleted);
        }
    
    });
    updateCategoryTotal(lastDeleted.category, parseFloat(lastDeleted.amount));

});

function updateCategoryTotal(category, amountChange) {
    if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
    }
    categoryTotals[category] += amountChange;

    renderCategoryTotals();
}

function renderCategoryTotals() {
    categoryTotalsList.innerHTML = ''; // clear existing
    for (const category in categoryTotals) {
        const li = document.createElement('li');
        li.textContent = `${category}: ₹${categoryTotals[category].toFixed(2)}`;
        categoryTotalsList.appendChild(li);
    }
}

    loadExpenses();
});



