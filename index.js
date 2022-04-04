require('dotenv').config();

// Configuration for MySQL
const mysql = require('mysql');
const host = 'localhost';
const user = 'aita';
const database = 'testdb';
const password = process.env.pass;

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, access_token'
  );

  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(allowCrossDomain);

app.get('/', (req, res) => {
  res.status(200).send('Hello Express!!');
});

// Create
app.post('/new', (req, res) => {
  const connection = mysql.createConnection({
    host,
    user,
    database,
    password,
  });

  console.log('CALL: /new at\t', Date.now())

  connection.connect();
  connection.query(
    `INSERT INTO account_book (date, category, content, amount) VALUES ("${req.body.date}", "${req.body.category}", "${req.body.content}", "${req.body.amount}");`,
    (error, row, fields) => {
      if (error) {
        console.error(error);
        res.json({ message: 'Error' });
      } else {
        res.json({ message: `Succeeded at ${Date.now()}` });
        console.log('(Browser) Succeeded at\t', Date.now())
      }
    }
  );
  connection.end();
});

// Read
app.get('/get/all', (req, res) => {
  const connection = mysql.createConnection({
    host,
    user,
    database,
    password,
  });

  console.log('CALL: /get/all at\t', Date.now())

  connection.connect();
  connection.query('SELECT * FROM account_book;', (error, row, fields) => {
    if (error) console.error(error);

    const dat = row.map((item) => {
      return {
        id: item.id,
        date: item.date,
        category: item.category,
        content: item.content,
        amount: item.amount,
      };
    });

    const ret = JSON.stringify(dat);
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.send(ret);
    console.log('(Browser) Succeeded at\t', Date.now())
  });
  connection.end();
});

// Read
app.get('/get/:id', (req, res) => {
  const connection = mysql.createConnection({
    host,
    user,
    database,
    password,
  });

  console.log('CALL: /get/:id at\t', Date.now())

  connection.connect();
  connection.query(
    `SELECT * FROM account_book WHERE id = ${req.params.id};`,
    (error, row, fields) => {
      if (error) console.error(error);

      const dat = row.map((item) => {
        return {
          id: item.id,
          date: item.date,
          category: item.category,
          content: item.content,
          amount: item.amount,
        };
      });

      const ret = JSON.stringify(dat);
      res.header('Content-Type', 'application/json; charset=utf-8');
      res.send(ret);
      console.log('(Browser) Succeeded at\t', Date.now())
    }
  );
  connection.end();
});

// Update
app.post('/edit', (req, res) => {
  const connection = mysql.createConnection({
    host,
    user,
    database,
    password,
  });

  console.log('CALL: /edit at\t', Date.now())

  connection.connect();
  connection.query(
    `UPDATE account_book SET \
    date = "${req.body.date}", \
    category = "${req.body.category}", \
    content = "${req.body.content}", \
    amount = "${req.body.amount}" \
    WHERE id = ${req.body.id};`,
    (error, row, fields) => {
      if (error) {
        console.error(error);
        res.json({ message: 'Error' });
      } else {
        res.json({ message: `Succeeded at ${Date.now()}` });
        console.log('(Browser) Succeeded at\t', Date.now())
      }
    }
  );
  connection.end();
});

// Delete
app.delete('/delete/:id', (req, res) => {
  const connection = mysql.createConnection({
    host,
    user,
    database,
    password,
  });

  console.log('CALL: /delete at\t', Date.now())

  connection.connect();
  connection.query(
    `DELETE FROM account_book WHERE id = ${req.params.id};`,
    (error, row, fields) => {
      if (error) {
        console.error(error);
        res.json({ message: 'Error' });
      } else {
        res.json({ message: `Succeeded at ${Date.now()}` });
        console.log('(Browser) Succeeded at\t', Date.now())
      }
    }
  );
  connection.end();
});

app.listen(port);
console.log(`listen: http://${host}:${port}`);
