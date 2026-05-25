  const express = require('express');
  const bodyParser = require('body-parser');
  const mysql = require('mysql2');

  const app = express();
  const port = 3000;
  app.use(express.json()); // Make sure to parse JSON body
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static('public'));

  // MySQL connection
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'customersdb'
  });

  db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
  });

// /add route
app.post('/add', (req, res) => {
  const { name, address, phone } = req.body;
  console.log(name)
  const sql = 'INSERT INTO customer (name, address, phone) VALUES (?, ?, ?)';
  db.query(sql, [name, address, phone], (err, result) => {
    if (err) throw err;
    res.redirect('/users');
  });
});

// /submit route
app.post('/submit', (req, res) => {
  console.log(req.body);
  const { name, Roll, address } = req.body;
  const sql = 'INSERT INTO students (name, Roll, address) VALUES (?, ?, ?)';
  db.query(sql, [name, Roll, address], (err, result) => {
    if (err) throw err;
    res.send('Data inserted successfully');
  });
});

// /submit route


app.post('/delete', (req, res) => {
  
  const { id } = req.body;
  if (!id) return res.status(400).send('ID is required');

  const sql = 'DELETE FROM customer WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    if (result.affectedRows === 0) return res.status(404).send('Customer not found');
    res.send('Customer deleted successfully');
  });
});

app.post('/update', (req, res) => {
  // Destructure required fields from request body
  const { id, name, Roll, address } = req.body;

  if (!id || !name || !Roll || !address) {
    return res.status(400).send('Please provide id, name, Roll, and address');
  }

  const sql = 'UPDATE customer SET name = ?, Roll = ?, address = ? WHERE id = ?';

  db.query(sql, [name, Roll, address, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Student not found');
    }

    res.send('Data updated successfully');
  });
});


// /users route
// Customers list API
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM customer order by id desc';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    //console.log(results.toString())
    res.json(results);
  });
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
