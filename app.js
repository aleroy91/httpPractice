const getUrl = "http://localhost:3000/get";
const postUrl = "http://localhost:3000/post";
const deleteUrl = "http://localhost:3000/delete";
let postData = '';
let list = '';

const getTodos = () => {
    clearList();
    selectList();

    fetch(getUrl)
    .then(res => res.text())
    .then((data) => {
        let output = JSON.parse(data);

        Object.values(output).forEach((element) => {
            let listItem = document.createElement("li");
            let itemContent = document.createTextNode(element);
            listItem.appendChild(itemContent);
            list.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error:', error));    
}

const postTodos = () => {
    postData = document.getElementById('inputMessage').value;

    fetch(postUrl, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({message: postData}),
        mode: "cors"
    })
    .then(res => res)
    .catch(error => console.error('Error:', error));

    clearInputField();
}

const clearTodos = () => {
    selectList();
    clearList();

    fetch(deleteUrl, {
        method: 'DELETE',
        headers:{
          'Content-Type': 'application/json'
        },
        mode: "cors"
    })
    .then(res => res)
    .catch(error => console.error('Error:', error));
}

const clearInputField = () => document.getElementById('inputMessage').value = '';
const selectList = () => list = document.getElementById('returnMessage');
const clearList = () => {
    if (list) {
        while (list.childElementCount > 0) {
            list.children[0].remove();
        }
    }
}