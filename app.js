const getUrl = "http://localhost:3000/get";
const postUrl = "http://localhost:3000/post";
const deleteUrl = "http://localhost:3000/delete";
const editUrl = "http://localhost:3000/put";
let postData = '';
let list = '';

const retrieveTodos = () => {
    clearList();
    selectList();

    fetch(getUrl)
    .then(res => res.text())
    .then((data) => {
        let output = JSON.parse(data);

        Object.values(output).forEach((element) => {
            createTodoElement(element.name, element.id);
        });
    })
    .catch(error => console.error('Error:', error));    
}

const addTodos = () => {
    if (hitEnter()) {
        selectList();
        let todoId = list.childElementCount;
        let newTodo = document.getElementById('inputMessage').value;

        if (newTodo) {
            fetch(postUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: todoId,
                    message: newTodo
                }),
                mode: "cors"
            })
            .then(res => res.text())
            .catch(error => console.error('Error:', error));    
        }

        createTodoElement(newTodo, todoId);
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
    .then(res => res.text())
    .catch(error => console.error('Error:', error));
}

const deleteTodo = () => { 
    let listPosition = retrieveIndexOfElement(event.target.parentElement);
    let id = event.target.parentElement.id;
    list.children[listPosition].remove();

    fetch(deleteUrl + `/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: id}),
        mode: "cors"
    })
    .then(res => res.text())
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
    let id = event.target.parentElement.id;
    let message = event.target.value;
    let listItemToEdit = retrieveIndexOfElement(event.target.parentElement);

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

    updateTodo(listItemToEdit, message);
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

const createTodoElement = (newTodo, todoId) => {
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
    itemDiv.id = todoId;
    itemDiv.appendChild(listItem);
    itemDiv.appendChild(deleteButton);
    itemDiv.appendChild(editBox);

    listItem.className = 'todoItem';
    listItem.appendChild(itemContent);
    listItem.onclick = () => openTextBox();

    deleteButton.className = 'deleteButton';
    deleteButton.textContent = '\u{00D7}';
    deleteButton.onclick = () => deleteTodo();
}

const clearInputField = () => document.getElementById('inputMessage').value = '';

const selectList = () => list = document.getElementById('returnMessage');

const hitEnter = () => {
    if (event.keyCode === (13 || 16) && event.target.value) {
        return true;
    } 
        
    return false;
}