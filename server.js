const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // ← your MySQL password
  database: 'login_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ MySQL Connected');
});

  app.use(express.static('public'));
  
// ✅ Register New User
app.post('/ragister', (req, res) => {
 //alert("hiii");
  const { name,Roll,address,Gender,Parents,password } = req.body;
  const sql = 'INSERT INTO students (name,Roll,address,Gender,Parents,password) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [name,Roll,address,Gender,Parents,password], (err, result) => {
    if (err) throw err;
    res.send('Data inserted successfully');
  });
});

// ✅ Login Existing User
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('❌ Login Error:', err);
      return res.status(500).send('❌ Server error');
    }

    if (results.length > 0) {
      res.send('✅ Login successful!');
    } else {
      res.status(401).send('❌ Invalid username or password');
    }
  });
});

// ✅ Start Server
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
