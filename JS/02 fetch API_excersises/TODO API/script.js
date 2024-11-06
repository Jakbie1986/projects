const addTaskBtn = document.querySelector('#addTask');
const todoList = document.querySelector('#todo');
const doneList = document.querySelector('#done');
const searchInput = document.querySelector('#searchInput');
const sortCategory = document.querySelector('#category');
const sortDirection = document.querySelector('#sortDirection');
const searchBtn = document.querySelector('#searchBtn');
const previousPage = document.querySelector('#previousPage');
const nextPage = document.querySelector('#nextPage');
let page = 1;
let maxPage = false;

const validationInputs = (titleInput, descriptionInput) => titleInput.value.trim() !== '' && descriptionInput.value.trim() !== '';

const validationError = () => {
    alert('Należy podać tytuł i opis')
}

const addTask = async () => {
    const titleInput = document.querySelector('#title');
    const descriptionInput = document.querySelector('#description');

    if(!validationInputs(titleInput, descriptionInput)){
        return validationError();
    }

    const postToApi = await fetch('http://localhost:3000/todos', {
        method: 'post',
        body: JSON.stringify({
            title: titleInput.value,
            description: descriptionInput.value,
            status: 0
        }),
        headers: {
            "Content-Type": "application/json",
        }
    });

    const response = await postToApi.json();
    addTaskToList(response);
    
    titleInput.value = '';
    description.value = '';
}

addTaskBtn.addEventListener('click', addTask); 

const changeTaskStatus = async (task, taskItem, taskTitle, taskDescription) => {
    const request = await fetch(`http://localhost:3000/todos/${task.id}/`, {
        method: 'put',
        body: JSON.stringify({
            ...task,
            status: task.status === 0 ? 1 : 0
        }),
        headers: {
            "Content-Type": "application/json",
        }
    });

    const response = await request.json();

    const changeStatusButton = taskItem.querySelector('button');
    changeStatusButton.innerText = response.status === 0 ? 'Zrobione' : 'Do zrobienia' 

    task.status = response.status;

    if(task.status === 1){
        taskItem.querySelector('div').lastElementChild.remove();
        const doneButton = document.createElement('button');
        doneButton.addEventListener('click', e => deleteTask(task.id, taskItem));
        doneButton.innerText = 'Usuń';
        taskItem.querySelector('div').append(doneButton);
    } else {
        taskItem.querySelector('div').lastElementChild.remove();
        const editButton = document.createElement('button');
        editButton.addEventListener('click', e => editTask(task, taskItem, taskTitle.value, taskDescription.value));
        editButton.innerText = 'Edytuj';
        taskItem.querySelector('div').append(editButton);
    }
    
    response.status === 0 ? todoList.append(taskItem) : doneList.append(taskItem);
}

const deleteTask = async (id, taskItem) => {
        const request = await fetch(`http://localhost:3000/todos/${id}/`, {
            method: 'delete',
        });

        taskItem.remove();
    }

const saveTask = async (task, taskItem, titleInput, descriptionInput) => {
    
    if(!validationInputs(titleInput, descriptionInput)){
        return validationError();
    }

    const request = await fetch(`http://localhost:3000/todos/${task.id}/`, {
        method: 'put',
        body: JSON.stringify({
            ...task,
            title: titleInput.value,
            description: descriptionInput.value,
        }),
        headers: {
            "Content-Type": "application/json",
        }
    });

    const response = await request.json()
    task.title = response.title;
    task.description = response.description;

    taskItem.querySelector('h3').innerText = task.title;
    taskItem.querySelector('p').innerText = task.description;

    taskItem.querySelector('div').style.display = 'block';
    taskItem.querySelector('div').nextElementSibling.remove();
}

const editTask = (task, taskItem) => {
    const taskContent = taskItem.querySelector('div');
    taskContent.style.display = 'none';
    
    const editInputs = document.createElement('div');
    const editTitleInput = document.createElement('input');
    editTitleInput.value = task.title;
    
    const editDescriptionInput = document.createElement('input');
    editDescriptionInput.value = task.description;
    
    const saveButton = document.createElement('button');
    saveButton.addEventListener('click', e => saveTask(task, taskItem, editTitleInput, editDescriptionInput));
    saveButton.innerText = 'Zapisz';
    
    editInputs.append(editTitleInput, editDescriptionInput, saveButton);
    taskItem.append(editInputs);
}

const addTaskToList = (task) => {
    
    const taskItem = document.createElement('li');
    const taskContent = document.createElement('div');
    const taskTitle = document.createElement('h3');
    taskTitle.innerText = task.title;

    const taskDescription = document.createElement('p');
    taskDescription.innerText = task.description;

    const changeStatusButton = document.createElement('button');
    changeStatusButton.addEventListener('click', e => changeTaskStatus(task, taskItem, taskTitle, taskDescription));
    changeStatusButton.innerText = task.status === 0 ?  'Zrobione!' : 'Do zrobienia!';

        
    taskContent.append(taskTitle, taskDescription, changeStatusButton);

   if(task.status === 1){
        const doneButton = document.createElement('button');
        doneButton.addEventListener('click', e => deleteTask(task.id, taskItem));
        doneButton.innerText = 'Usuń';
        taskContent.append(doneButton);
    } else {
        const editButton = document.createElement('button');
        editButton.addEventListener('click', e => editTask(task, taskItem, taskTitle.value, taskDescription.value));
        editButton.innerText = 'Edytuj';
        taskContent.append(editButton);
    }
    taskItem.append(taskContent);
    task.status === 0 ? todoList.append(taskItem) : doneList.append(taskItem);
}


const fetchAllTasks = async (e) => {
    
    if(e && e.target.id === 'previousPage' && page > 0){
        page--;
        maxPage = false;
    }
    else if(e && e.target.id === 'nextPage' && !maxPage){
        page++;
    }
    
    let endpoint = `?_sort=${sortCategory.value}&_order=${sortDirection.value}&_page=${page}&_limit=2`;
    if(searchInput.value.trim().length > 0){
        endpoint += `&q=${searchInput.value}`;
    }

    const request = await fetch(`http://localhost:3000/todos${endpoint}`);
    const response = await request.json();
    
   if(response.length){
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    response.forEach(task => addTaskToList(task));
   }
   else{
    maxPage = true;
   }
}

fetchAllTasks();

searchBtn.addEventListener('click', fetchAllTasks);
sortBtn.addEventListener('click', fetchAllTasks);
previousPage.addEventListener('click', fetchAllTasks);
nextPage.addEventListener('click', fetchAllTasks);


