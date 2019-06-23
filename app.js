// Send GET request to server

const url = "http://localhost:3000/get";
const getMessage = () => {
    fetch(url)
    .then((res) => {
        return res.text();
    })
    .then((data) => {
        let output = `<h4>${data}</h4>`;
        document.getElementById('returnMessage').innerHTML = output;
    })
}