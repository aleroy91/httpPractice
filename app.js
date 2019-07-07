const getUrl = "http://localhost:3000/get";
const postUrl = "http://localhost:3000/post";
let postData = '';

const getMessage = () => {
    fetch(getUrl)
    .then(res => res.text())
    .then((data) => {
        let output = JSON.parse(data);
        let list = document.getElementById('returnMessage');

        Object.values(output).forEach((element) => {
            let listItem = document.createElement("li");
            let itemContent = document.createTextNode(element);
            listItem.appendChild(itemContent);
            list.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error:', error));
}

const postMessage = () => {
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

const clearInputField = () => document.getElementById('inputMessage').value = '';