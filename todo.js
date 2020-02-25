"use strict";

/*jslint browser: true, devel: true*/
let addButton = document.querySelector('.add');
let inputTask = document.querySelector('.new-task');
let unfinishedTasks = document.querySelector('.todos');
let finishedTasks = document.querySelector('.complete');

function createNewElement(task, loadCheckbox) {
    let listItem = document.createElement('li');
    let checkbox = document.createElement('button');
    checkbox.className = "material-icons checkbox md-13";
    if (loadCheckbox)
        checkbox.innerText = "check_box";
    else
        checkbox.innerText = "check_box_outline_blank";
    let label = document.createElement('label');
    label.innerText = task;
    if (loadCheckbox) label.className = "complete";
    let input = document.createElement('input');
    input.type = "text";
    input.style.display = "none";
    let buttonEdit = document.createElement('button');
    buttonEdit.className = "material-icons edit md-13";
    buttonEdit.innerText = "edit";
    if (loadCheckbox) 
        buttonEdit.style.display = "none";
    else
        buttonEdit.style.display = "inline-black";
        
    let buttonDelete = document.createElement('button');
    buttonDelete.className = "material-icons delete md-13";
    buttonDelete.innerText = "delete";

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(input);
    listItem.appendChild(buttonEdit);
    listItem.appendChild(buttonDelete);

    return listItem;
}


function addTask() {
    if (inputTask.value) {
        let listItem = createNewElement(inputTask.value, false);
        unfinishedTasks.appendChild(listItem);
        bindTaskEvents(listItem, finishTask);
        inputTask.value = "";
    }
    
    save();
}

addButton.onclick = addTask;

function deleteTask() {
    let listItem = this.parentNode;
    let ul = listItem.parentNode;
    ul.removeChild(listItem);
    
    save();
}

function editTask() {
    let editButton = this;
    let listItem = this.parentNode;
    let label = listItem.querySelector('label');
    let input = listItem.querySelector('input[type="text"]');

    let containsClass = listItem.classList.contains('editMode');

    if (containsClass) {
        label.innerText = input.value;
        label.style.display = "inline-block";
        input.style.display = "none";
        editButton.className = "material-icons edit md-13";
        editButton.innerText = "edit";
        save();
    } else {
        input.value = label.innerText;
        label.style.display = "none";
        input.style.display = "inline-block";
        editButton.className = "material-icons edit md-13";
        editButton.innerText = "save";
    }

    listItem.classList.toggle('editMode');
}

function finishTask() {
    let listItem = this.parentNode;
    let checkbox = listItem.querySelector('button.checkbox');
    let buttonEdit = listItem.querySelector('button.edit');
    let label = listItem.querySelector('label');
    let input = listItem.querySelector('input[type="text"]');
    checkbox.className = "material-icons checkbox md-13";
    checkbox.innerText = "check_box";
    buttonEdit.style.display = "none";
    buttonEdit.innerText = "edit";
    label.style.display = "inline-block";
    label.className = "complete";
    input.style.display = "none";
    
    finishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, unfinishTask);
    
    save();
}

function unfinishTask() {
    let listItem = this.parentNode;
    let checkbox = listItem.querySelector('button.checkbox');
    let buttonEdit = listItem.querySelector('button.edit');
    let label = listItem.querySelector('label');
    checkbox.className = "material-icons checkbox md-13";
    checkbox.innerText = "check_box_outline_blank";
    buttonEdit.style.display = "inline-block";
    label.className = "";
    
    unfinishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, finishTask);
    
    save();
}

function bindTaskEvents(listItem, checkboxEvent) {
    let checkbox = listItem.querySelector('button.checkbox');
    let editButton = listItem.querySelector('button.edit');
    let deleteButton = listItem.querySelector('button.delete');

    checkbox.onclick = checkboxEvent;
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
}

function save() {
    let unfinishedTasksArr = [];
    let finishedTasksArr = [];
    
    for(let i = 0; i < unfinishedTasks.children.length; i++) {
        unfinishedTasksArr.push(unfinishedTasks.children[i].getElementsByTagName('label')[0].innerText);
    }
    
    for(let i = 0; i < finishedTasks.children.length; i++) {
        finishedTasksArr.push(finishedTasks.children[i].getElementsByTagName('label')[0].innerText);
    }
    
    localStorage.removeItem('todo');
    localStorage.setItem('todo', JSON.stringify({
        unfinishedTasks:unfinishedTasksArr,
        finishedTasks:finishedTasksArr
    }))
}
    
function load() {
        return JSON.parse(localStorage.getItem('todo'));
}

let data = load();
for(let i = 0; i < data.unfinishedTasks.length; i++) {
    let listItem = createNewElement(data.unfinishedTasks[i], false);
    unfinishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, finishTask);
}

for(let i = 0; i < data.finishedTasks.length; i++) {
    let listItem = createNewElement(data.finishedTasks[i], true);
    finishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, unfinishTask);
}
