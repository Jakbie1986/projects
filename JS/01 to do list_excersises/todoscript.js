const tittleInput = document.querySelector('#input');
const descriptionTextarea = document.querySelector('#textarea');
const addButton = document.querySelector('#add');
const toDoList = document.querySelector('#to_do');
const doneList = document.querySelector('#done');
const errorsList = document.querySelector('#error_message');

const delTask = (e) => {
    const listElement = e.target.closest('li');
    listElement.remove();
}

const moveToDone = (e) => {
    const listElement = e.target.closest('li');
    const doneButton = listElement.querySelector('button');
    doneButton.remove();
    const delBtn = document.createElement('button');
    delBtn.innerText = 'Usuń';
    delBtn.addEventListener('click', delTask);
    listElement.appendChild(delBtn);
    doneList.appendChild(listElement);
}

const addToList = () => {
    errorsList.innerHTML = '';
    if(tittleInput.value.length === 0){
        const tittleError = document.createElement('li');
        tittleError.innerText = 'Tytuł jest wymagany';
        errorsList.appendChild(tittleError);
    }

    if(descriptionTextarea.value.length === 0){
        const descriptionError = document.createElement('li');
        descriptionError.innerText = 'Opis jest wymagany';
        errorsList.appendChild(descriptionError);
    }
    
    if(tittleInput.value.length === 0 || descriptionTextarea.value.length === 0){
        return;
    }

    const titleElement = document.createElement('h2');
    titleElement.innerText = tittleInput.value;

    const descriptionElement = document.createElement('p');
    descriptionElement.innerText = descriptionTextarea.value;

    const doneButton = document.createElement('button');
    doneButton.innerText = 'Zrobione';
    doneButton.addEventListener('click', moveToDone);

    const listElement = document.createElement('li');
    listElement.append(titleElement, descriptionElement, doneButton);

    toDoList.appendChild(listElement);
    tittleInput.value = '';
    descriptionTextarea.value = '';
    
}
addButton.addEventListener('click', addToList);