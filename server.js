const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors');
const sqlite3 = require('sqlite3');

const app = express();
const db = new sqlite3.Database('./db.sqlite');

db.run('CREATE TABLE IF NOT EXISTS test (name);', (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("DB Created");
    }
});

app.use(morgan('tiny'));
app.use(bodyParser());
app.use(cors());

app.get('/get', (req, res) => {
    // if () {
        // res.send("test")
    // } else {
        let messageFromDatabase = () => 'SELECT COUNT(*) FROM test;';
        res.send(messageFromDatabase);
    // }
});

app.post('/post', (req, res, next) => {
    console.log(req.body);

    let testMessage = req.body.message; 
    res.status(201).send();

    db.run('INSERT INTO test VALUES ($testMessage);', {
        $testMessage: testMessage
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});