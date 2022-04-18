// Class
class Todo {
    constructor(name, deadline, time) { 
        const _deadline = new Date(deadline);
        this.id = generateUUID();      
        this.name = name;
        this.completed = false;
        this.deadline = deadline;
        this.deadlineTime = time;
        this.createdDate = Date.now();
        this.year = _deadline.getFullYear();
        this.month = _deadline.getMonth() + 1;
        this.day = _deadline.getDate();
    }
}


// Massiv
const todoList = [];
getTodoListFromLocalStorage(); // funksiya ishga tushganda localStorgeda malimot bo'lsa o'ziga to'ldirib oladi
reload();
// Funksiyalar
// DOM forma ma'lumotlarni o'qish
function saveToLocaleStorage() { // yangi ma'lumot qo'shilganda yoki o'chrilganida ishlatiladi
    localStorage.setItem('todoList', JSON.stringify(todoList)); // tablitsadagi ocirgai o'zgarishlarni saqlaydi
}
function getTodoListFromLocalStorage() { //
    let todoListString = localStorage.getItem('todoList');
    if(todoListString) {
        const result = JSON.parse(todoListString);
        todoList.push(...result);
    }
}
function reload() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    for (let index = 0; index < todoList.length; index++) {
        const element = todoList[index];
        const row = createTableRow(element, index + 1);
        addRowToTable(row);
    }
}
function getTodoValues() { // 'DOM'dan forma ma'lumotlarni o'qish
    const name = document.querySelector('textarea[name = "todoName"]')?.value;
    const deadline = document.querySelector('input[name = "todoDeadline"]')?.value;
    const deadlineTime = document.querySelector('input[name = "todoDeadlineTime"]')?.value; 
    return { name, deadline, deadlineTime }
}
function setTodoValues(item) { // 'DOM' ga farma ma'lumotlarni yozish
    const name = document.querySelector('textarea[name = "todoName"]');
    const deadline = document.querySelector('input[name = "todoDeadline"]');
    const deadlineTime = document.querySelector('input[name = "todoDeadlineTime"]');
    name.value = item.name;
    deadline.value = item.deadline;
    deadlineTime.value = item.deadlineTime; // TIME ???
}
function addTodo(name, deadline, time) { // addTodo funksiyasi ma'lumotlarni todoList massivga qo'shib beradi
    // logics
    const newTodo = new Todo(name, deadline, time);
    todoList.push(newTodo);
    saveToLocaleStorage(); // eng oxirgi massivni localStoragega saqlab qo'yadi o'zgarish bo'lgan vaqtda
    reload();
}
function setEditMode(isEdit) { // Qo'shish knopkasi 
    const addBtn = document.querySelector('#addBtn');
    const editBtn = document.querySelector('#editBtn');
    if(isEdit) {
        addBtn.disabled = true;
        editBtn.removeAttribute('disabled');
    } 
    else {
        addBtn.removeAttribute('disabled');
        editBtn.disabled = true;
    }
}
setEditMode(false); // edditMode is disebled da 
function clearForm() {
    const name = document.querySelector('textarea[name = "todoName"]');
    const deadline = document.querySelector('input[name = "todoDeadline"]');
    name.value = '';
    deadline.value = '';
    setEditMode(false);
}
function editTodo(id) {
    // alert(id);
    const editBtn = document.getElementById('editBtn'); // Taxrirlash
    const editItem = todoList.find(a => a.id === id);
    setTodoValues(editItem);
    editBtn.setAttribute('data-id', id);
    setEditMode(true);
}
function generateUUID() { // id number with guid generator // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
// Events
const body = document.querySelector('tbody'); // tabledagi ma'lumotni o'qish
body.addEventListener('click', (event) => {
    event.stopPropagation();
    document.querySelector('tr').classList.remove('primary');
    console.log(event.path[1].classList.add('primary'));
})

const addBtn = document.getElementById('addBtn'); // Qo'shish
const editBtn = document.getElementById('editBtn'); // Taxrirlash 
addBtn.addEventListener('click', () => { // click bosilganda valueni qiymatlarni olinadi, olingan malumotlar massivga qishiladi 
    const todoForm = document.getElementById('todoForm');

    const {name, deadline, deadlineTime} = getTodoValues(); // const {Obyektlarni valuega olish} = Destructuring assignment
    // Validatsion - formaning holati bo'sh yoki bo'sh emas 
    if (name && deadline) {
        addTodo(name, deadline, deadlineTime); // addTodo funksiyasi chaqriladi
        clearForm();
    } 
    else {
        return;
        alert('Ma\'lumotlarni to\'linq kiriting');
    }    
})
editBtn.addEventListener('click', (event) => { // click bosilganda valueni qiymatlarni olinadi, olingan malumotlar massivga qishiladi 
    const { name, deadline, deadlineTime } = getTodoValues(); // const {Obyektlarni valuega olish} = Destructuring assignment
    // Validatsion - formaning holati bo'sh yoki bo'sh emas 
   
    const todoId = event.target.dataset.id;
    const editTodoItem = todoList.find(a => a.id === todoId);
    
    if (name && deadline) {
        editTodoItem.name = name; // o'zgartrilgan nom
        editTodoItem.deadline = deadline; // o'zgartrilgan sana
        editTodoItem.deadlineTime = deadlineTime; // o'zgartrilgan vaqt
        // addTodo(name, deadline);
        saveToLocaleStorage(); // todoListni to'ligicha localStoragega saqlash
        clearForm();
        reload();

    } 
    else {
        return;
        alert('Ma\'lumotlarni to\'linq kiriting');
    }

})

// Template

function addRowToTable(row) {
    const tbody = document.querySelector(`tbody`);
    tbody.innerHTML += row;
}
function createTableRow(todo, number) {
    return `<tr data-id='${todo.id}'>
<td>${number}</td> 
<td>${todo.name}</td>
<td>${todo.deadline} ${todo.deadlineTime}</td>   
<td>${new Date(todo.createdDate)}</td>
<td>
    <input type="checkbox">
</td>
<td>
    <button class="btn btn-danger">
        <span class="fa fa-trash">
        
        </span>
    </button>
    <button onclick = "editTodo('${todo.id}')" class="btn btn-info">
        <span class="fa fa-edit">
        
        </span>
    </button>
</td>
</tr>`
}