const getUrl = "http://localhost:3000/get";
const postUrl = "http://localhost:3000/post";
const deleteUrl = "http://localhost:3000/delete";
let postData = '';
let list = '';

/*  TODOs
    
    * Change add todo's function so that it adds todos to the ui
    * Add edit function
    * Implement local storage
        - Remove get button
        - Send all list additions, edits and deletions to the db
        - For the sake of speed, the UI should make use of localstorage when app is running
        - When starting the server afresh, the list should build from the contents of the db
        - This should be marked with a little loading symbols

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
            let itemContent = document.createTextNode(element.name);

            deleteButton.className = 'deleteButton';
            itemDiv.className = 'mainButton todoContainer';
            list.appendChild(itemDiv);
            listItem.className = 'todoItem';
            listItem.appendChild(itemContent);
            itemDiv.appendChild(listItem);
            itemDiv.appendChild(deleteButton);
            deleteButton.textContent = '\u{00D7}';
            deleteButton.onclick = () => { 
                deleteTodo()
            };
        });
    })
    .catch(error => console.error('Error:', error));    
}

const addTodos = () => {
    newTodo = document.getElementById('inputMessage').value;

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
        .catch(error => console.error('Error:', error));    
    }

    let itemDiv = document.createElement('div');
    let deleteButton = document.createElement('span');
    let listItem = document.createElement('span');
    let itemContent = document.createTextNode(newTodo);

    deleteButton.className = 'deleteButton';
    itemDiv.className = 'mainButton todoContainer';
    document.getElementById('returnMessage').appendChild(itemDiv);
    listItem.className = 'todoItem';
    listItem.appendChild(itemContent);
    itemDiv.appendChild(listItem);
    itemDiv.appendChild(deleteButton);
    deleteButton.textContent = '\u{00D7}';
    deleteButton.onclick = () => { 
        deleteTodo()
    };

    clearInputField();
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
    .catch(error => console.error('Error:', error));
}

const deleteTodo = () => { 
    let elementToDelete = event.target.parentElement;

    let id = retrieveIndexOfElementToDelete(elementToDelete);

    fetch(deleteUrl + `/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: id}),
        mode: "cors"
    })
    .then(res => res)
    .catch(error => console.error('Error:', error));
}

const retrieveIndexOfElementToDelete = (elementToDelete) => {
    for (let i = 0; i < list.children.length; i++) {
        if (list.children[i] === elementToDelete) {
            list.children[i].remove();
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
    if (event.keyCode === (13 || 16)) {
        addTodos();
    }
}