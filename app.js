const getUrl = "http://localhost:3000/get";
const postUrl = "http://localhost:3000/post";
const deleteUrl = "http://localhost:3000/delete";
const editUrl = "http://localhost:3000/put";
let postData = '';
let list = '';

/*  TODOs
    
    * Refactor code so no duplicate between the retrieve and add functions (for UI creation)
    * Use a loading symbol animation in css: https://codepen.io/aleksander351/pen/KzgKPo

*/

const retrieveTodos = () => {
    clearList();
    selectList();

    fetch(getUrl)
    .then(res => res.text())
    .then((data) => {
        let output = JSON.parse(data);

        Object.values(output).forEach((element) => {
            let itemDiv = document.createElement('div');
            let deleteButton = document.createElement('span');
            let listItem = document.createElement('span');
            let editBox = document.createElement('input');
            let itemContent = document.createTextNode(element.name);
            
            editBox.hidden = true;
            editBox.className = 'input';
            editBox.onblur = () => closeTextBox();
            editBox.onkeyup = () => addEditedTodo();

            list.appendChild(itemDiv);

            itemDiv.className = 'mainButton todoContainer';
            itemDiv.appendChild(listItem);
            itemDiv.appendChild(deleteButton);
            itemDiv.appendChild(editBox);

            listItem.className = 'todoItem';
            listItem.appendChild(itemContent);
            listItem.onclick = () => openTextBox();

            deleteButton.className = 'deleteButton';
            deleteButton.textContent = '\u{00D7}';
            deleteButton.onclick = () => deleteTodo();
        });
    })
    .catch(error => console.error('Error:', error));    
}

const addTodos = () => {
    if (hitEnter()) {
        selectList();
        let newTodo = document.getElementById('inputMessage').value;

        if (newTodo) {
            fetch(postUrl, {
                method: 'POST',
                headers:{
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({message: newTodo}),
                mode: "cors"
            })
            .then(res => res)
            .then(result => result.text())
            .catch(error => console.error('Error:', error));    
        }

        let itemDiv = document.createElement('div');
        let deleteButton = document.createElement('span');
        let listItem = document.createElement('span');
        let editBox = document.createElement('input');
        let itemContent = document.createTextNode(newTodo);
        
        editBox.hidden = true;
        editBox.className = 'input';
        editBox.onblur = () => closeTextBox();
        editBox.onkeyup = () => addEditedTodo();

        list.appendChild(itemDiv);

        itemDiv.className = 'mainButton todoContainer';
        itemDiv.appendChild(listItem);
        itemDiv.appendChild(deleteButton);
        itemDiv.appendChild(editBox);

        listItem.className = 'todoItem';
        listItem.appendChild(itemContent);
        listItem.onclick = () => openTextBox();

        deleteButton.className = 'deleteButton';
        deleteButton.textContent = '\u{00D7}';
        deleteButton.onclick = () => deleteTodo();

        clearInputField();
    }
}

const clearTodos = () => {
    selectList();
    clearList();

    fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: "cors"
    })
    .then(res => res)
    .then(result => result.text())
    .catch(error => console.error('Error:', error));
}

const deleteTodo = () => { 
    let elementToDelete = event.target.parentElement;
    let id = retrieveIndexOfElement(elementToDelete);
    list.children[id].remove();

    fetch(deleteUrl + `/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: id}),
        mode: "cors"
    })
    .then(res => res)
    .then(result => result.text())
    .catch(error => console.error('Error:', error));
}

const openTextBox = () => {
    let todoContainerElements = event.target.parentElement.children;

    for (let i = 0; i < todoContainerElements.length; i++) {
        if (todoContainerElements[i].className !== 'input') {
            todoContainerElements[i].hidden = true;
        } else {
            todoContainerElements[i].hidden = false;
            todoContainerElements[i].focus();
        }
    }
}

const closeTextBox = () => {
    let todoContainerElements = event.target.parentElement.children;

    for (let i = 0; i < todoContainerElements.length; i++) {
        if (todoContainerElements[i].className === 'input') {
            todoContainerElements[i].hidden = true;
        } else {
            todoContainerElements[i].hidden = false;
        }
    }
}

const addEditedTodo = () => {
    if (hitEnter()) {
        editTodo();
    }
}

const editTodo = () => { 
    let indexToEdit = event.target.parentElement;
    let message = event.target.value;

    let id = retrieveIndexOfElement(indexToEdit);

    fetch(editUrl + `/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            message: message
        }),
        mode: "cors"
    })
    .then(res => res)
    .then(result => result.text())
    .catch(error => console.error('Error:', error));

    updateTodo(id, message);
}

const updateTodo = (index, content) => {

    list.children[index].children[0].innerText = content;
    closeTextBox();
}

const retrieveIndexOfElement = (element) => {
    for (let i = 0; i < list.children.length; i++) {
        if (list.children[i] === element) {
            return i;
        }
    }
}

const clearList = () => {
    if (list) {
        while (list.childElementCount > 0) {
            list.children[0].remove();
        }
    } 
}

const clearInputField = () => document.getElementById('inputMessage').value = '';

const selectList = () => list = document.getElementById('returnMessage');

const hitEnter = () => {
    if (event.keyCode === (13 || 16) && event.target.value) {
        return true;
    } 
        
    return false;
}