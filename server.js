const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
// const sqlite3 = require('sqlite3');

const app = express();
// const db = new sqlite3.Database('./db.sqlite');

app.use(morgan('tiny'));
app.use(cors());

app.get('/get', (req, res) => res.send('Hello World!'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});