const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const sqlite3 = require('sqlite3');

/* LONG ASS EXPLANATION RE. DATABASES

    I want to replace sqlite with mysql, for scalability reasons.
    However, this is not currently possible because the node package for mysql
    does not yet support the default authentication method of MySQL 8;
    rather, it is based on weak password protection practices which are now very old.

    So because I decided to install the latest version of MySQL, I now have to wait for the 
    node software to support MySQL 8 Authentication. There is currently a pull request 
    for this which is undergoing testing, so hopefully it should be available soon!

    Check here to see how it is progressing:

    https://github.com/mysqljs/mysql/pull/2233

*/

const db = new sqlite3.Database('./db.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }

    console.log('Connected to the database.');
});

app.use(morgan('tiny'));
app.use(bodyParser());
app.use(cors());

db.run(`CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY ASC, name STRING);`, (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("DB 'test' Created");
    }
});

app.get('/get', (req, res) => {
    db.all('SELECT * FROM test ORDER BY id', (err, rows) => {
        if (err) {
            throw err;
        }

        let data = {};

        rows.forEach((row, i) => {
            data[i] = {
                name: row.name
            };
        });

        res.send(data);
    });
});

app.post('/post', (req, res) => {
    let id = req.body.id;
    let testMessage = req.body.message; 

    db.run('INSERT INTO test (id, name) VALUES ($id, $testMessage);', {
        $id: id,
        $testMessage: testMessage
    }, (err) => {
        if (err) {
            throw err;
        }

        console.log(`The following record has been created: ${testMessage}`);
        res.status(201).send();
    });
});

app.put('/put/:id', (req, res) => {
    let idNumber = req.body.id + 1;
    let message = req.body.message;

    db.run('UPDATE test SET name = $message WHERE id = $id;', {
        $id: idNumber,
        $message: message
    }, (err) => {
        if (err) {
            throw err;
        }
    
        console.log(`The record at index ${idNumber} has been changed to ${message}`);
        res.status(200).send();
    });
});

app.delete('/delete', (req, res) => {
    db.run('DELETE FROM test;', (err) => {
        if (err) {
            throw err;
        }
    });

    console.log("All Records Deleted"); 
    res.status(200).send();    
});

app.delete('/delete/:id', (req, res) => {
    let idNumber = req.body.id + 1;

    db.run('DELETE FROM test WHERE id = $id;', {
        $id: idNumber
    }, (err) => {
        if (err) {
            throw err;
        }
    });

    db.all('SELECT * FROM test ORDER BY id', (err, rows) => {    
        let data = {};

        rows.forEach((row, i) => {
            data[i] = {
                name: row.name
            };
        });

        console.log(`The record at index ${idNumber} has been deleted`);
        res.status(200).send(data);    
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});