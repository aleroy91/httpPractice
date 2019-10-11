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
      console.error(err.message)
    }

    console.log('Connected to the database.')
});

app.use(morgan('tiny'));
app.use(bodyParser());
app.use(cors());

db.run(`CREATE TABLE IF NOT EXISTS test (name string);`, (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("DB 'test' Created");
    }
});

app.get('/get', (req, res) => {
    db.all('SELECT * FROM test ORDER BY ROWID', (err, rows) => {
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
    let testMessage = req.body.message; 

    db.run('INSERT INTO test VALUES ($testMessage);', {
        $testMessage: testMessage
    }, (err) => {
        if (err) {
            throw err;
        }

        console.log(`The following record has been created: ${testMessage}`);
    });
});

app.put('/put/:id', (req, res) => {
    let id = req.body.id + 1;
    let message = req.body.message;

    db.run('UPDATE test SET name = $message WHERE rowid = $id;', {
        $id: id,
        $message: message
    }, (err) => {
        if (err) {
            throw err;
        }
    
        console.log(`The record at index ${id} has been changed to ${message}`);
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

app.delete('/delete/:id', (req, res) => {
    let id = req.body.id + 1;

    db.run('DELETE FROM test WHERE rowid = $id;', {
        $id: id
    }, (err) => {
        if (err) {
            throw err;
        }
    
        console.log(`The record at index ${id} has been deleted`);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});