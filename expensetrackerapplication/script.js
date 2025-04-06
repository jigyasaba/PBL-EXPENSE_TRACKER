//array of objects expense[0]=>get the first expense object
//each object here acts like an  associative arrray
let expenses =[];
let totalAmount = 0;

const categorySelect = document.getElementById('category-select')
const amountInput = document.getElementById('amount-input')
const dateInput = document.getElementById('date-input')
const addBtn = document.getElementById('add-btn')
const expenseTableBody = document.getElementById('expense-table-body')
const totalAmountCell = document.getElementById('total-amount')

addBtn.addEventListener('click',()=>{
    const category = categorySelect.value;//TO SET AND RETRIEVE THE VALUE OF FORM ELEMENTS WE USE VALUE
    const amount = Number(amountInput.value);
    const date= dateInput.value;

    if(category === ''){
        alert('please select a category');
        return;
    }
    if(isNaN(amount) || amount <= 0){
        alert('please enter a valid amount');
        return;
    }
    if(date ===''){
        alert('please select a date');
        return;
    }
    expenses.push({category,amount,date})

    totalAmount += amount;
    totalAmountCell.textContent=totalAmount;

    const newRow = expenseTableBody.insertRow();

    const categoryCell = newRow.insertCell();
    const AmountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();

    const deleteBtn = document.createElement('button');

    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');//new class added to classs list which helps in styling
    deleteBtn.addEventListener('click',()=>{
        expenses.splice(expenses.indexOf(expense),1);
        totalAmount -= expense.amount;
        totalAmountCell.innerHTML = "<b>"+totalAmount+"</b>";
        totalAmountCell.style.color="red";
        expenseTableBody.removeChild(newRow);
    })
    const expense= expenses[expenses.length - 1];
    categoryCell.textContent=expense.category;
    AmountCell.textContent=expense.amount;
    dateCell.textContent=expense.date;
    deleteCell.appendChild(deleteBtn);

});
for(const exepense of expenses){
    totalAmount += amount;
    totalAmountCell.textContent=totalAmount;

    const newRow = expenseTableBody.insertRow();

    const categoryCell = newRow.insertCell();
    const AmountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();

    const deleteBtn = document.createElement('button');

    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function(){
        expenses.splioce(expenses.indexOf(expense),1);

        totalAmount -= expense.amount;
        totalAmountCell.textContent = totalAmount;

        expenseTableBody.removeChild(newRow);
    })
    const expense= expenses[expenses.length - 1];
    categoryCell.textContent=expense.category;
    AmountCell.textContent=expense.amount;
    dateCell.textContent=expense.date;
    deleteCell.appendChild(deleteBtn);
}