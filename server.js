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

// var mysql = require('mysql')
// var db = mysql.createConnection({
//   host: 'localhost',
//   user: 'dbuser',
//   password: 'Mossadegh1953',
//   database: 'my_db'
// })

// db.connect()
const db = new sqlite3.Database('./db.sqlite');

app.use(morgan('tiny'));
app.use(bodyParser());
app.use(cors());

db.run('CREATE TABLE IF NOT EXISTS test (name);', (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("DB Created");
    }
});

app.get('/get', (req, res) => {
    db.all('SELECT DISTINCT Name name FROM test ORDER BY name', (err, rows) => {
        if (err) {
            throw err;
        }

        let data = {};

        rows.forEach((row, i) => {
            data[i] = row.name;
        });

        res.send(data);
    });
});

app.post('/post', (req, res) => {
    console.log(req.body);

    let testMessage = req.body.message; 
    res.status(201).send();

    db.run('INSERT INTO test VALUES ($testMessage);', {
        $testMessage: testMessage
    }, (err) => {
        if (err) {
            throw err;
        }
    });
});

app.delete('/delete', (res) => {
    db.run('DELETE FROM test;', (err) => {
        if (err) {
            throw err;
        }

        console.log("All Records Deleted");
    });
});

app.delete('/deleteItem', (req, res) => {
    let name = req.body.name;

    db.run('DELETE FROM test WHERE name = $name;', {
        $name: name
    }, (err) => {
        if (err) {
            throw err;
        }
    
        console.log(`The following record has been deleted: ${name}`);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});