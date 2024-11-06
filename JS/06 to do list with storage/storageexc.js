const listElement = document.querySelector('#todo_list');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const buttonAdd = document.querySelector('#addTask');

const addToLocalStorage = () => {
    const localstorageTasks = localStorage.getItem('tasks');

    const taskObject = {
        title: titleInput.value,
        description: descriptionInput.value
    }

    if(localstorageTasks === null){
        localStorage.setItem('tasks', JSON.stringify([taskObject]));
    } else {
        const tasksArray = JSON.parse(localStorage.getItem('tasks'));
        tasksArray.push(taskObject);

        localStorage.setItem('tasks', JSON.stringify(tasksArray));
    }
}


const updateLocalStorage = () => {
    const tasksArray = [];
    document.querySelectorAll('li').forEach(task => {
        const taskObject = {
            title: task.querySelector('h2').innerText,
            description: task.querySelector('p').innerText
        }

        tasksArray.push(taskObject);
    });

    localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

const updateLocalStorage2 = (title, description, liElement) => {
    const editIndex = [...document.querySelectorAll('li')].indexOf((liElement));

    const lsArray = JSON.parse(localStorage.getItem('tasks'));
    lsArray[editIndex] = {title: title, description: description};
    localStorage.setItem('tasks', JSON.stringify(lsArray));
}

const removeTask = (e) => {
    const removeIndex = [...document.querySelectorAll('li')].indexOf(e.target.parentElement);
    const lsArray = JSON.parse(localStorage.getItem('tasks'));

    lsArray.splice(removeIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(lsArray));

    e.target.parentElement.remove();
}

const saveEditedTask = (e) => {
    const liElement = e.target.parentElement;
    const title = [...e.target.parentElement.querySelectorAll('input')][0].value;
    const description = [...e.target.parentElement.querySelectorAll('input')][1].value;
    renderTask(title, description, liElement);

    updateLocalStorage2(title, description, liElement);

}

const editTask = (e) => {
    const liElement = e.target.parentElement;

    const taskTitle = document.createElement('input');
    taskTitle.value = e.target.parentElement.querySelector('h2').innerText;
    
    const taskDescription = document.createElement('input');
    taskDescription.value = e.target.parentElement.querySelector('p').innerText;

    const saveBtn = document.createElement('button');
    saveBtn.innerText = 'Zapisz';
    saveBtn.addEventListener('click', saveEditedTask);

    e.target.parentElement.innerHTML = "";

    liElement.append(taskTitle, taskDescription, saveBtn);
}

const renderTask = (title, description, listItemElement = null) => {
    const taskTitle = document.createElement('h2');
    taskTitle.innerText = title;

    const taskDescription = document.createElement('p');
    taskDescription.innerText = description;

    const removeBtn = document.createElement('button');
    removeBtn.innerText = 'Usuń';
    removeBtn.addEventListener('click', removeTask);

    const editBtn = document.createElement('button');
    editBtn.innerText = "edytuj";
    editBtn.addEventListener('click', editTask);

    
    if(listItemElement !== null){
        listItemElement.innerHTML = '';
        listItemElement.append(taskTitle, taskDescription, removeBtn, editBtn);

    } else {
        const listItemElement = document.createElement('li');
        listItemElement.append(taskTitle, taskDescription, removeBtn, editBtn);
        listElement.append(listItemElement)
    };   
}


const renderTaskEvent = () => {
    renderTask(titleInput.value, descriptionInput.value);
    addToLocalStorage();
    titleInput.value = '';
    descriptionInput.value = "";
}

buttonAdd.addEventListener('click', renderTaskEvent);

const renderTasksFromLocalStorage = () => {
    if(localStorage.getItem('tasks') !== null){
        JSON.parse(localStorage.getItem('tasks')).forEach(task => renderTask(task.title, task.description));
    }
}

renderTasksFromLocalStorage();